import path from 'node:path';

export const config = {
  port: process.env.PORT || 3000,
  uploadsDir: path.join(process.cwd(), "uploads"),
  tmpDir: path.join(process.cwd(), "tmp"),
  workerPath: path.join(process.cwd(), "src", "worker", "worker.js"),
};
