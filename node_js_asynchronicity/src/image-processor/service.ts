import os from "node:os";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { Mutex } from "async-mutex";
import { SharedState } from "./interfaces";
import { config } from "../config/config";
import pLimit from "p-limit";

const WORKER_PATH = config.workerPath;

export class AppService {
  async processImages(dirPath: string, files: string[]) {
    const sharedState: SharedState = {
      processed: 0,
      skipped: 0,
    };
    const limit = os.availableParallelism();
    const mutex = new Mutex();
    const limiter = pLimit(limit);

    const tasks = files.map((file) => {
      return limiter(async () => {
        return this.processImageInWorker(
          path.join(dirPath, file),
          path.join(dirPath, `processed_${file}`),
          mutex,
          sharedState,
        );
      });
    });

    await Promise.all(tasks);
    return sharedState;
  }

  private async processImageInWorker(
    inputPath: string,
    outputPath: string,
    mutex: Mutex,
    sharedState: SharedState,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const worker = new Worker(WORKER_PATH, {
        execArgv: ["--no-warnings"],
        workerData: {
          inputPath,
          outputPath,
        },
      });

      worker.once("message", async () => {
        await mutex.runExclusive(() => sharedState.processed++);
        resolve();
      });

      worker.once("error", async () => {
        await mutex.runExclusive(() => sharedState.skipped++);
        resolve();
      });
    });
  }
}
