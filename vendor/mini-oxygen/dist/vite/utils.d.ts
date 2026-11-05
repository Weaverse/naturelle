import { ServerResponse, IncomingMessage } from 'node:http';
import { Request as Request$1 } from 'miniflare';

/**
 * Creates a fully qualified URL from a Node request or a string.
 * In the case of a Node request, it uses the host header to determine the origin.
 */
declare function toURL(req?: string | IncomingMessage, origin?: string): URL;
/**
 * Turns a Node request into a Web request by using native Node APIs.
 */
declare function toWeb(req: IncomingMessage, headers?: Record<string, string>): Request<unknown, any>;
/**
 * Reads from a Web response and writes to a Node response
 * using @mjackson/node-fetch-server for proper streaming support.
 */
declare function pipeFromWeb(webResponse: Response, res: ServerResponse): Promise<void>;
declare function toMiniflareRequest(request: Request): Request$1;

export { pipeFromWeb, toMiniflareRequest, toURL, toWeb };
