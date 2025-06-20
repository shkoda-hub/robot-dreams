import {IncomingMessage, ServerResponse} from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';

import {
  IRoute,
  ISegment,
  RequestOptions,
  RouteModule,
} from './router.interfaces';
import {config} from '../config/config';

const { env } = config;
const ROUTES_DIR = path.resolve(__dirname, '../routes');

export class Router {
  private routes: IRoute[];
  private initPromise: Promise<void> | null;

  constructor() {
    this.routes = [];
    this.initPromise = null;
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    await this.ensureInit();
    const { url, method } = req;

    if (!url || !method) {
      return;
    }

    const { pathname } = new URL(url, `http://${req.headers.host}`);

    for (const route of this.routes) {
      const match = route.regex.exec(pathname);
      if (!match) continue;

      if (env === 'development') {
        await this.hotReload(route);
      }

      if (!route.methods) {
        route.methods = await import(route.file + `?t=${Date.now()}`) as RouteModule;
      }

      const handler = route.methods[method];
      if (!handler) {
        return await this.handleHandlerIsNotExist(res);
      }

      const values = match.slice(1);
      const params: Record<string, string> = {};
      route.params.forEach((name, i) => {
        params[name] = values[i];
      });

      let body = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        try {
          body = JSON.parse(Buffer.concat(chunks).toString());
        } catch {
          res.writeHead(400);
          return res.end('Bad JSON');
        }
      }

      return handler(req, res, { params, body } as RequestOptions);
    }
    res.writeHead(404);
    res.end('Not Found');
  }

  private async scan(dir: string, segments: ISegment[]) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        const m = ent.name.match(/^\[([^/]+)]$/);

        const seg: ISegment = m
          ? { name: m[1],     isParam: true }
          : { name: ent.name, isParam: false };

        await this.scan(fullPath, segments.concat(seg));
      } else if (ent.isFile() && /^routes\.(js|ts)$/.test(ent.name)) {
        const paramNames = segments.filter(s => s.isParam).map(s => s.name);
        const regexpStr = '^/' + segments.map(
          s => s.isParam ? '([^/]+)' : s.name
        ).join('/') + '/?$';

        this.routes.push({
          regex:   new RegExp(regexpStr),
          params:  paramNames,
          file:    fullPath,
          methods: null,
        });
      }
    }
  }

  public async ensureInit() {
    if (!this.initPromise) {
      this.initPromise = this.init();
    }

    return this.initPromise;
  }

  private async init() {
    this.routes = [];
    await this.scan(ROUTES_DIR, []);
  }

  private async hotReload(route: IRoute) {
    const stat = await fs.stat(route.file);
    if (!route.lastMtime || stat.mtimeMs > route.lastMtime) {
      route.methods = await (await import(route.file + `?t=${Date.now()}`)) as RouteModule;
      route.lastMtime = stat.mtimeMs;
    }
  }

  private async handleHandlerIsNotExist(res: ServerResponse) {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end('Method Not Allowed');
  }
}
