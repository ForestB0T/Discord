import "dotenv/config";
import ForestBot from "./structure/discord/Client.js";
import Database from "./structure/database/Pool.js";
import Options from "./structure/config.js";
export * from './structure/config.js';

const opts = new Options();

export const db: Database = new Database(opts.database)
export const client: ForestBot = new ForestBot(opts.discord);
await client.login()
