import AdmZip from "adm-zip";
import path from "node:path";
import { config } from "../config/config";

export async function unzip(
  filePath: string,
  requestId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(filePath);
    zip.extractAllToAsync(
      path.join(config.tmpDir, requestId),
      true,
      false,
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
}
