const MAX_SIDE = 900;
const QUALITY = 0.72;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB de entrada
export const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/** Redimensiona e devolve dataURL webp leve (~80–150KB) */
export async function compressImage(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Use JPG, PNG ou WebP.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Imagem acima de 8MB.");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  return canvas.toDataURL("image/webp", QUALITY);
}
