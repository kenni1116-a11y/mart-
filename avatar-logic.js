(function exposeMartAvatarLogic(root, factory) {
  const logic = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = logic;
  root.MartAvatarLogic = logic;
}(typeof globalThis !== "undefined" ? globalThis : self, () => {
  const avatarColorChoices = Object.freeze([
    Object.freeze({ id: "graphite", color: "#4d5d71" }),
    Object.freeze({ id: "ocean", color: "#2f7792" }),
    Object.freeze({ id: "forest", color: "#3f7867" }),
    Object.freeze({ id: "amber", color: "#a8732c" }),
    Object.freeze({ id: "berry", color: "#9a5365" }),
    Object.freeze({ id: "violet", color: "#705a9c" })
  ]);

  function initialsFor(name) {
    const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    return words.slice(0, 2).map((word) => word.slice(0, 1).toUpperCase()).join("");
  }

  function defaultDecodeImage(file) {
    if (typeof createImageBitmap === "function") return createImageBitmap(file);
    if (typeof Image !== "function" || typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
      return Promise.reject(new Error("image_decode_unsupported"));
    }
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
        source: image,
        close() { URL.revokeObjectURL(url); }
      });
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("image_decode_failed"));
      };
      image.src = url;
    });
  }

  function defaultCreateCanvas() {
    if (typeof document === "undefined") throw new Error("canvas_unavailable");
    return document.createElement("canvas");
  }

  function defaultEncodeCanvas(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("image_encode_failed"));
      }, type, quality);
    });
  }

  async function resizeAvatarFile(file, options = {}) {
    const maxDimension = Number.isFinite(options.maxDimension) ? options.maxDimension : 512;
    const targetBytes = Number.isFinite(options.targetBytes) ? options.targetBytes : 200 * 1024;
    const decodeImage = options.decodeImage ?? defaultDecodeImage;
    const createCanvas = options.createCanvas ?? defaultCreateCanvas;
    const encodeCanvas = options.encodeCanvas ?? defaultEncodeCanvas;
    const image = await decodeImage(file);
    const width = Number(image?.width ?? image?.naturalWidth);
    const height = Number(image?.height ?? image?.naturalHeight);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      image?.close?.();
      throw new Error("image_dimensions_invalid");
    }

    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));
    const canvas = createCanvas();
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext?.("2d");
    if (!context?.drawImage) {
      image?.close?.();
      throw new Error("canvas_unavailable");
    }

    try {
      context.drawImage(image.source ?? image, 0, 0, targetWidth, targetHeight);
      let smallest = null;
      for (let quality = 0.86; quality >= 0.58; quality = Number((quality - 0.08).toFixed(2))) {
        const blob = await encodeCanvas(canvas, "image/webp", quality);
        if (!blob) continue;
        if (!smallest || blob.size < smallest.size) smallest = blob;
        if (blob.size <= targetBytes) return blob;
      }
      if (smallest) return smallest;
      throw new Error("image_encode_failed");
    } finally {
      image?.close?.();
    }
  }

  return Object.freeze({
    initialsFor,
    avatarColorChoices,
    resizeAvatarFile
  });
}));
