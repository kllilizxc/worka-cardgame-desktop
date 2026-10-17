import type { BattleTrial } from '../src/battle-experiment';

/** Browser-only presentation host. All combat, summoning and end-turn rules remain in BattleScene. */
export function createPhaserBattleTrial(runtime: { Phaser: any; BattleScene: any; CardSprite: any }, parent: HTMLElement) {
  const { Phaser, BattleScene, CardSprite } = runtime;
  let active = false;
  return async (input: { seed: number; turnLimit: number; actionLimit: number; policyVersion: string; deck: Array<{ id: string; count: number }>; encounterId: string; encounterFile: string; signal?: AbortSignal }): Promise<BattleTrial> => {
    if (active) throw Error('同一战斗容器不能并发运行');
    if (!Number.isInteger(input.turnLimit) || input.turnLimit < 1 || input.turnLimit > 200 || !Number.isInteger(input.actionLimit) || input.actionLimit < 1 || input.actionLimit > 10_000) throw Error('无效对局预算');
    if (input.policyVersion !== 'first-free-unit-per-turn-v1') throw Error('未支持的自动策略');
    if (input.signal?.aborted) throw Error('对局已取消');
    const deck = seededDeck(input.deck, input.seed);
    active = true;
    let game: any, timeout: ReturnType<typeof setTimeout>, finished = false, actions = 0, observedTurn = 0;
    const playedCardIds: string[] = [];
    let resolveResult!: (result: BattleTrial) => void, rejectResult!: (error: unknown) => void;
    const promise = new Promise<BattleTrial>((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
    function fail(error: unknown) { if (finished) return; finished = true; rejectResult(error); }
    function complete(scene: any, outcome: BattleTrial['outcome'], reason?: string) {
      if (finished) return;
      // Capture data now; scene destruction must not change the recorded terminal snapshot.
      const state = scene.battleContext?.battleState;
      const cardData = (cards: any[]) => cards.map(card => structuredClone(card.getCardData()));
      const snapshot = { playerHealth: state.playerHealth, turnNumber: state.turnNumber, isPlayerTurn: state.isPlayerTurn,
        playerField: cardData(state.playerField), enemyField: cardData(state.enemyField), hand: cardData(state.hand), deck: structuredClone(state.deck), discardPile: structuredClone(state.discardPile) };
      finished = true;
      void crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(snapshot))).then(bytes => resolveResult({ outcome,
        turns: Math.min(state.turnNumber, input.turnLimit), actions, playedCardIds: [...playedCardIds],
        finalStateHash: [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join(''), ...(reason ? { reason } : {}) }), rejectResult);
    }
    class AutomatedBattle extends BattleScene {
      async create() {
        try {
          await super.create();
          for (const method of ['showVictory', 'showDefeat']) {
            const show = this.battleContext.turnManager[method].bind(this.battleContext.turnManager);
            this.battleContext.turnManager[method] = (onContinue: () => void) => { show(onContinue); this.time.delayedCall(0, onContinue); };
          }
          const selection = this.deckSelectionUI, originalShow = selection.show.bind(selection);
          selection.show = (...args: any[]) => {
            originalShow(...args);
            this.time.delayedCall(0, () => {
              try {
                if (finished) return;
                const count = args[1] ?? 1;
                const choices = selection.cardSprites.slice(0, count);
                if (!choices.length) throw Error('选择提示没有支持的候选');
                for (const choice of choices) {
                  if (actions >= input.actionLimit) { complete(this, 'incomplete', '达到选择动作预算'); return; }
                  actions++; choice.emit('pointerdown');
                }
                if (count > 1) selection.confirmSelection();
              } catch (error) { fail(error); }
            });
          };
        } catch (error) { fail(error); }
      }
      // This callback occurs through the game's normal turn start. Defer the policy until its draw/status work completes.
      enablePlayerInteraction() {
        BattleScene.prototype.enablePlayerInteraction.call(this);
        this.time.delayedCall(0, () => {
          try {
            if (finished) return;
            const state = this.battleContext.battleState;
            if (!state.isPlayerTurn || state.isProcessingTurn || state.turnNumber === observedTurn) return;
            if (state.turnNumber > input.turnLimit || actions >= input.actionLimit) { complete(this, 'incomplete', '达到回合或动作预算'); return; }
            observedTurn = state.turnNumber;
            const card = state.hand.find((candidate: any) => candidate instanceof CardSprite && this.sacrificeManager.getSacrificeRequired(candidate.getCardData()) === 0);
            if (card && actions < input.actionLimit) {
              actions++;
              if (this.playCardToField(card)) playedCardIds.push(card.getCardData().id);
            }
            if (finished) return;
            if (actions >= input.actionLimit) { complete(this, 'incomplete', '达到动作预算'); return; }
            this.time.delayedCall(0, () => {
              if (finished) return;
              if (actions >= input.actionLimit) { complete(this, 'incomplete', '达到动作预算'); return; }
              actions++; BattleScene.prototype.endTurn.call(this);
            });
          } catch (error) { fail(error); }
        });
      }
      // Observe the actual terminal callback before the normal scene would navigate and persist a campaign result.
      handleBattleEnd(victory: boolean) { complete(this, victory ? 'victory' : 'defeat'); }
    }
    class CatalogBoot extends Phaser.Scene {
      constructor() { super('ExperimentCatalog'); }
      preload() {
        this.load.json('contentCatalog', 'data/content-catalog.json');
        this.load.on('loaderror', (file: any) => fail(Error(`资源加载失败：${file.key}`)));
      }
      create() {
        this.scene.start('BattleScene', { runId: `experiment-${input.seed}`, nodeId: 'experiment', nodeType: 'battle',
          encounterId: input.encounterId, encounterResourceId: input.encounterId, encounterFile: input.encounterFile,
          runDeck: deck.map(id => ({ id, count: 1 })), deterministicBattleSetup: { deckOrder: 'preserve-json-order' } });
      }
    }
    const abort = () => fail(Error('对局已取消'));
    const runtimeError = (event: ErrorEvent) => fail(Error(event.message || '战斗运行错误'));
    try {
      input.signal?.addEventListener('abort', abort, { once: true });
      window.addEventListener('error', runtimeError);
      timeout = setTimeout(() => fail(Error('对局运行超时；不计入胜败')), 120_000);
      game = new Phaser.Game({ type: Phaser.AUTO, parent, width: 1920, height: 1080, backgroundColor: '#1a1a2e',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1920, height: 1080 },
        render: { antialias: false, pixelArt: true, roundPixels: true }, scene: [CatalogBoot, AutomatedBattle], audio: { noAudio: true } });
      return await promise;
    } finally {
      clearTimeout(timeout!); input.signal?.removeEventListener('abort', abort); window.removeEventListener('error', runtimeError);
      game?.destroy(true); active = false;
    }
  };
}
/** The game explicitly supports a preserved startup order; the experiment supplies a seeded permutation as input. */
export function seededDeck(stacks: Array<{ id: string; count: number }>, seed: number): string[] {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff || !stacks.length || stacks.some(stack => !stack.id?.trim() || !Number.isInteger(stack.count) || stack.count < 1 || stack.count > 200)) throw Error('无效牌组或种子');
  const deck = stacks.flatMap(stack => Array<string>(stack.count).fill(stack.id));
  if (deck.length > 500) throw Error('实验牌组超过 500 张');
  let state = seed >>> 0;
  const random = () => { state = (state + 0x6d2b79f5) >>> 0; let value = Math.imul(state ^ state >>> 15, 1 | state); value ^= value + Math.imul(value ^ value >>> 7, 61 | value); return ((value ^ value >>> 14) >>> 0) / 4294967296; };
  for (let index = deck.length - 1; index > 0; index--) { const other = Math.floor(random() * (index + 1)); [deck[index], deck[other]] = [deck[other]!, deck[index]!]; }
  return deck;
}
