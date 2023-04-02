import { readFile } from "fs/promises";
import { ClientOptions, PartialTypes, Intents } from "discord.js";

export const color = JSON.parse(await readFile('./extras/colors.json') as any);
export const cnf = JSON.parse(await readFile('./config.json') as any);

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
    websocket_url = cnf.websocket_url
}