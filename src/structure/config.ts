import { readFile } from "fs/promises";
import { ClientOptions, PartialTypes, Intents } from "discord.js";
import { ForestBotAPIOptions } from "forestbot-api-wrapper-v2";

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

class ApiConfig implements ForestBotAPIOptions {
    apiUrl = cnf.apiUrl
    isBotClient = false
    websocket_url = cnf.websocket_url
    apiKey = process.env.apiKey
    logerrors = true
    use_websocket = true  
  };

export default class Options { 
    discord = new DiscordSettings()
    api = new ApiConfig()
}