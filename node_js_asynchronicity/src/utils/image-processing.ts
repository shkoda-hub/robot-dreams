import sharp from "sharp";

export async function processImage(inputPath: string, outputPath: string) {
  try {
    const { width, height } = await sharp(inputPath).metadata();

    await sharp(inputPath)
      .resize(width * 2, height * 2, {
        fit: "cover",
        position: "centre",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFormat("webp", {
        quality: 75,
        effort: 4,
        alphaQuality: 80,
      })
      .toFile(outputPath);
  } catch (e) {
    console.error("Error while processing image", e);
  }
}
