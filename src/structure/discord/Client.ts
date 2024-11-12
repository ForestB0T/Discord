import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection, Client, TextChannel, ColorResolvable } from "discord.js";
import { lstatSync } from "fs";
import { readdir } from "fs/promises";
import { client, cnf, color } from '../../index.js';
import path from "path";
import ErrorHandler from "./ErrorHandler.js";
import { fileURLToPath } from 'node:url';
import type Options from "../config";
import { ForestBotAPI, ForestBotAPIOptions } from "forestbot-api-wrapper-v2";
import apiHandler from "../api/forestapi.js";

export default class ForestBot extends Client {

    public API: apiHandler;

    public ErrorHandler: ErrorHandler;
    public commandCollection: Collection<string,{
        default: { 
            permissions:string[]|string; 
            run: any; 
            channel_strict: boolean; 
            requires_setup: boolean; 
            Iswhitelisted: boolean; 
        };
    }>;
    public apiUrl: string = cnf.apiUrl;
    public commands: any[];
    public cachedGuilds: Map<string, Guild> = new Map();
    public liveChatChannelCache: Map<string, { channelArgs: DiscordForestBotLiveChat, channel: TextChannel }> = new Map();

    constructor(options: Options["discord"], wsOpts: ForestBotAPIOptions) {
        super(options);
        this.API = new apiHandler(wsOpts);
        this.ErrorHandler = new ErrorHandler()
        this.token = process.env.prod == "true" ? process.env.TOKEN : process.env.TESTTOKEN
        this.commandCollection = new Collection();
        this.commands = [];
        this.once("ready", async () => {
            console.log(`Logged in as ${this.user.tag}!`);
            await this.syncGuildCache();
            await this.syncLiveChatChannelsCache();
            await this.handleEvents()
            await this.handleCommands()
        })
    }

    /**
 * 
 * Send messages to discord chat channels,
 * these messages will be sent to all discord channels
 * in the chatChannels array
 * 
 * @param text 
 * @param color 
 */
    public minecraftChatEmbed = async (text: string, c: string, mc_server: string) => {
        const channels = Array.from(this.liveChatChannelCache.values())
            .filter(({ channelArgs }) => channelArgs.mc_server === mc_server)
            .map(({ channel }) => channel);

        for (const channel of channels) {
            try {
                await channel.send({
                    embeds: [{
                        color: color[c] as ColorResolvable,
                        description: text
                    }]
                });
            } catch (error) {
                console.error(`Error sending message to channel ${channel.id} in guild ${channel.guild.name}: ${error}`);
                continue;
            }
        }
    };

    public async sendMessageToSudoChannel(text: string) { 
        const sudoChannel = this.channels.cache.get(cnf.sudoChannel) as TextChannel;
        if (!sudoChannel) return;
        await sudoChannel.send(text);
    }



    public async syncLiveChatChannelsCache() {
        const channels = await this.API.getAllLiveChatChannels();
        for (const channel of channels) {
            const discordTextChannel = this.channels.cache.get(channel.channelID);

            if (!discordTextChannel || discordTextChannel.type !== "GUILD_TEXT") continue;

            this.liveChatChannelCache.set(channel.channelID, { channelArgs: channel, channel: discordTextChannel });
        }

        for (const [key, _] of this.liveChatChannelCache) {
            if (!channels.some(channel => channel.channelID === key)) {
                this.liveChatChannelCache.delete(key);
            }
        }

    }

    public async syncGuildCache() {
        const guilds = await this.API.getAllGuilds();
        for (const guild of guilds) {
            this.cachedGuilds.set(guild.guild_id, guild);
        }
    }

    async handleEvents() {
        for (const file of (await readdir('./dist/events')).filter(file => file.endsWith(".js"))) {
            const event = (await import(`../../events/${file}`)).default;

            event.once
                ? this.once(event.name, (...args) => event.execute(...args, this))
                : this.on(event.name, (...args) => event.execute(...args, this))
        };
    }

    async handleCommands() {

        const loadCmd = async (file: string, dir?: string) => {
            const command = dir
                ? await import(`../../commands/${dir}/${file}`)
                : await import(`../../commands/${file}`)
            this.commands.push(command.default.data);
            this.commandCollection.set(command.default.data.name, command);
        }

        for (const element of await readdir('./dist/commands')) {
            element.endsWith("js") && await loadCmd(element);
            if (lstatSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../commands', element)).isDirectory()) {
                for (const file of (await readdir(`./dist/commands/${element}`)).filter(file => file.endsWith(".js")))
                    await loadCmd(file, element)
            };
        }


        const rest: REST = new REST({ version: '9' }).setToken(this.token);
        const botID = this.user.id
        cnf.load_guild_commands && await rest.put(Routes.applicationGuildCommands(botID, cnf.rootGuild), { body: client.commands }).catch(console.error);
        cnf.load_commands && await rest.put(Routes.applicationCommands(botID), { body: client.commands }).catch(console.error);

    }


}