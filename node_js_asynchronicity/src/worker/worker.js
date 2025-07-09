import { parentPort, workerData } from "node:worker_threads";
import { processImage } from "../utils/image-processing.ts";

const { inputPath, outputPath } = workerData;

(async () => {
  try {
    await processImage(inputPath, outputPath);
    parentPort.postMessage("processed");
  } catch {
    parentPort.postMessage("error");
  }
})();
