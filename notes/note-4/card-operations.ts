/** Explicit business operations shared by the note contract and domain service. */
export const CARD_OPERATIONS = ['createCardBatch', 'setCardDrafts', 'saveCardDraft', 'approveCardDrafts', 'requestCardArt', 'reuseCardArt', 'attachCardArt', 'assembleCardFaces', 'integrateCard', 'saveDeckPlan', 'confirmDeckDraft', 'prepareDeckArt', 'stageDeckCandidate'] as const;
