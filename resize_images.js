
import { Jimp } from "jimp";

async function resizeImage(filename) {
  try {
    const image = await Jimp.read(filename);
    const w = image.bitmap.width;
    const h = image.bitmap.height;

    // "Reduce width ratio slightly" -> shrink width relative to height.
    // "Reduce overall size slightly" -> shrink both.
    
    // Factors:
    // Scale X: 0.8 (Squeeze width and shrink)
    // Scale Y: 0.9 (Shrink height slightly less)
    
    const newW = Math.round(w * 0.8);
    const newH = Math.round(h * 0.9);

    console.log(`Resizing ${filename}: ${w}x${h} -> ${newW}x${newH}`);

    image.resize({ w: newW, h: newH });
    await image.write(filename);
    console.log(`Saved ${filename}`);
  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

async function main() {
  await resizeImage('worker.png');
  await resizeImage('worker2.png');
  await resizeImage('worker3.png');
  await resizeImage('worker4.png');
}

main();
