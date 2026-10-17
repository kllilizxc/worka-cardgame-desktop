---
name: worka-cardgame-production-assets
description: Register real production candidates and keep legacy adoption requests pending for explicit review.
eventScripts:
  cardgame.production.candidatesRequested: scripts/candidates.ts
  cardgame.production.adoptionRequested: scripts/adopt.ts
---

# CardGame 制作与资源库

制作结果只登记为候选，保留实际文件路径、候选 ID 和技术元数据。资源库的 registerCandidates 回执是候选身份来源；回填制作记录后才完成联动。重试沿用同一请求和连线操作 ID，不重复登记。

通用素材当前只支持查看、复制真实候选引用或否决，不支持直接采用。不要调用资源库 adoptVersion，也不能以文件工具绕过正式项目保护。卡牌与牌组回原制作单建立隔离试玩候选，试玩后由用户在功能进展确认。

旧 adoptionRequested 事件保留核对入口，返回待人工处理而不执行采用、回填成功或新增采用关联。若原操作可能已有副作用，先核对资源实际版本、原候选与真实回执；不要用新请求 ID 重放。历史采用事实仍保留且必须以真实资源服务回执核对。
