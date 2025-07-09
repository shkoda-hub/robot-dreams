import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import path from "node:path";
import * as fs from "node:fs/promises";
import { config } from "../config/config";
import { unzip } from "../utils/unzip";
import { AppService } from "./service";

export class AppController {
  private readonly service: AppService;

  constructor() {
    this.service = new AppService();
  }

  process = async (
    req: Request<unknown, unknown>,
    res: Response,
  ): Promise<void> => {
    const requestId = randomUUID();
    const dirPath = path.join(config.tmpDir, requestId);

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    try {
      await unzip(req.file.path, requestId);
      const files = await fs.readdir(dirPath);

      const start = performance.now();
      const result = await this.service.processImages(dirPath, files);
      const end = performance.now();

      res.status(200).json({ ...result, durationMs: Math.floor(end - start) });
    } catch (error) {
      console.error("Error during processing user`s archive", error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      await fs.rm(req.file.path, { recursive: true, force: true });
      await fs.rm(dirPath, { recursive: true, force: true });
    }
  };
}

export const controller = new AppController();
