import { REST }               from "@discordjs/rest";
import { Routes }             from "discord-api-types/v9";
import { Collection, Client } from "discord.js";
import { lstatSync }          from "fs";
import { readdir }            from "fs/promises";
import { client, cnf, db }            from '../../index.js';
import path                   from "path";
import ErrorHandler           from "./ErrorHandler.js";
import { fileURLToPath }      from 'node:url';
import type Options           from "../config";

export default class ForestBot extends Client {

    public ErrorHandler: ErrorHandler;
    public commandCollection: Collection<string, any>;
    public apiUrl: string = cnf.apiUrl;
    public commands: any[];
    public cachedGuilds: Map<string, Guild> = new Map();

    constructor(options: Options["discord"]) {
        super(options);
        this.ErrorHandler      = new ErrorHandler()
        this.token             = process.env.prod == "true" ? process.env.TOKEN : process.env.TESTTOKEN
        this.commandCollection = new Collection();
        this.commands          = [];
        this.on("ready", async () => {
            console.log(`Logged in as ${this.user.tag}!`);
            await this.syncGuildCache();
            await this.handleEvents()
            await this.handleCommands()
        })
    }

    async syncGuildCache() {
        const guilds = await db.getGuilds();
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