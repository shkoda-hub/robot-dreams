import {IncomingMessage, ServerResponse} from 'node:http';

export interface IRoute {
  regex: RegExp;
  params: string[];
  file: string;
  methods: RouteModule | null;
  lastMtime?: number;
}

export interface ISegment {
  name: string;
  isParam: boolean;
}

export interface RequestOptions<Body = Record<string, unknown>> {
  params: Record<string, string>;
  body: Body;
}

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  opts: RequestOptions,
) => Promise<void> | void;

export type RouteModule = Record<string, RouteHandler>

