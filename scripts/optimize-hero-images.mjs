import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const heroDir = path.join(process.cwd(), "public", "hero");
const photos = (await readdir(heroDir)).filter((name) => name.endsWith(".jpg"));

for (const name of photos) {
  const source = path.join(heroDir, name);
  const stem = name.slice(0, -4);
  for (const width of [1200, 1920]) {
    const destination = path.join(heroDir, `${stem}-${width}.webp`);
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(destination);
  }
}

const originalBytes = (await Promise.all(photos.map((name) => stat(path.join(heroDir, name)))))
  .reduce((sum, file) => sum + file.size, 0);
const webpBytes = (await Promise.all(photos.map(async (name) => {
  const stem = name.slice(0, -4);
  return stat(path.join(heroDir, `${stem}-1920.webp`));
}))).reduce((sum, file) => sum + file.size, 0);
console.log(`Optimized ${photos.length} hero photos: ${(originalBytes / 1048576).toFixed(1)} MiB JPEG → ${(webpBytes / 1048576).toFixed(1)} MiB desktop WebP`);
