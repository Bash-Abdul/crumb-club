export async function prepareKitchenPhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPG, PNG or WebP photograph.");
  if (file.size > 8 * 1024 * 1024)
    throw new Error("Choose a photograph smaller than 8 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
    } catch {
      throw new Error("This photograph couldn’t be opened. Try another one.");
    }
    if (!image.naturalWidth || !image.naturalHeight)
      throw new Error("This photograph couldn’t be opened. Try another one.");
    const scale = Math.min(
      1,
      1200 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Your browser couldn’t prepare this photograph.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL("image/webp", 0.8);
    if (photo.length > 1500000)
      throw new Error(
        "This photograph is too large to save here. Try a smaller one.",
      );
    return photo;
  } finally {
    URL.revokeObjectURL(url);
  }
}
