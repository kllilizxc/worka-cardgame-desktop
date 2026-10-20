import { Modal } from "@heroui/react";
import React, { useState } from "react";
import type { TodoImage } from "./actions";

const IMAGE_CSS = `
.cardgame-image-strip{display:flex;flex-wrap:wrap;gap:6px;min-width:0;margin:6px 0}
.cardgame-image-thumb{position:relative;width:62px;height:46px;margin:0;overflow:hidden;border:1px solid var(--wb-line);border-radius:5px;background:var(--wb-surface-deep)}
.cardgame-image-strip.is-compact .cardgame-image-thumb{width:34px;height:26px}
.cardgame-image-thumb:focus-within{outline:2px solid var(--wb-accent);outline-offset:2px}
.cardgame-image-preview{display:block;width:100%;height:100%;padding:0;border:0;background:transparent;cursor:zoom-in}
.cardgame-image-preview:focus-visible{outline:none}
.cardgame-image-preview img{display:block;width:100%;height:100%;object-fit:cover}
.cardgame-image-remove{position:absolute;top:1px;right:1px;width:18px;height:18px;padding:0;border:0;border-radius:50%;background:var(--wb-ink);color:var(--wb-paper);font-size:14px;line-height:16px;cursor:pointer}
.cardgame-image-strip.is-compact .cardgame-image-remove{width:14px;height:14px;font-size:11px;line-height:12px}
.cardgame-image-modal-dialog{background:var(--wb-paper);color:var(--wb-ink);box-shadow:var(--wb-shadow-popover);border-radius:var(--wb-radius)}
`;

export function ImageAttachments({ images, onRemove, compact = false }: {
  images?:readonly TodoImage[];
  onRemove?: (id: string) => void;
  compact?: boolean;
}) {
  const [previewImage, setPreviewImage] = useState<TodoImage | null>(null);
  const validImages = (images ?? []).filter(image => typeof image?.dataUrl === "string" && image.dataUrl.startsWith("data:image/"));
  if (!validImages.length) return null;
  return <>
    <style>{IMAGE_CSS}</style>
    <div className={`cardgame-image-strip ${compact ? "is-compact" : ""}`} aria-label={`${validImages.length} 张图片`}>
      {validImages.map((image, index) => <figure className="cardgame-image-thumb" key={image.id || `${index}-${image.dataUrl.slice(0, 24)}`}>
        <button type="button" className="cardgame-image-preview" aria-label={`放大预览：${image.name || `图片 ${index + 1}`}`}
          aria-haspopup="dialog" onClick={event => { event.stopPropagation(); setPreviewImage(image); }}>
          <img src={image.dataUrl} alt="" loading="lazy" />
        </button>
        {onRemove && <button type="button" className="cardgame-image-remove" aria-label={`移除图片 ${index + 1}`}
          onClick={event => { event.stopPropagation(); onRemove(image.id); }}>×</button>}
      </figure>)}
    </div>
    <Modal isOpen={Boolean(previewImage)} onOpenChange={isOpen => { if (!isOpen) setPreviewImage(null); }}>
      <Modal.Backdrop variant="blur" onClick={event => event.stopPropagation()}>
        <Modal.Container placement="center" size="md">
          <Modal.Dialog aria-label="图片预览" className="cardgame-image-modal-dialog"
            style={{ width: "fit-content", minWidth: 180, minHeight: 120, maxWidth: "min(94vw, 1200px)", maxHeight: "94dvh", padding: "34px 10px 10px" }}>
            <Modal.CloseTrigger aria-label="关闭图片预览" style={{ position: "absolute", top: 8, right: 8 }} />
            <Modal.Body style={{ display: "grid", placeItems: "center", minWidth: 160, minHeight: 80, padding: 0, maxWidth: "calc(94vw - 20px)", maxHeight: "calc(94dvh - 44px)", overflow: "hidden" }}>
              {previewImage && <img src={previewImage.dataUrl} alt={previewImage.name || "图片预览"}
                style={{ display: "block", width: "auto", height: "auto", maxWidth: "calc(94vw - 40px)", maxHeight: "calc(88dvh - 48px)", objectFit: "contain", borderRadius: 4 }} />}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  </>;
}
