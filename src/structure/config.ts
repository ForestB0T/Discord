import { readFile } from "fs/promises";
import { ClientOptions, PartialTypes, Intents } from "discord.js";
import { PoolConfig } from 'mysql';

export const color = JSON.parse(await readFile('./extras/colors.json') as any);
export const cnf = JSON.parse(await readFile('./config.json') as any);

class DatabaseOptions implements PoolConfig {
    host               = process.env.host;
    user               = process.env.user;
    password           = process.env.pass;
    database           = process.env.database;
    multipleStatements = true
}

class DiscordSettings implements ClientOptions {
    partials: PartialTypes[] = ['CHANNEL']
    intents = [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
}

export default class Options { 
    discord = new DiscordSettings()
    database = new DatabaseOptions()
}