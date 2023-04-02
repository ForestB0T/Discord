import "dotenv/config";
import ForestBot        from "./structure/discord/Client.js";
import Options          from "./structure/config.js";
import WebSocketHandler from "./structure/websocket/ws.js";
import ForestBotAPI     from "./structure/api/forestapi.js";
export *                from './structure/config.js';

const opts = new Options();

export const client    = new ForestBot(opts.discord);
export const websocket = new WebSocketHandler(`${opts.websocket_url}/authenticate`)
export const api       = new ForestBotAPI();
await client.login()
