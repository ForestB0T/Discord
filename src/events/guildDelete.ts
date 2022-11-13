import { Interaction, Guild } from 'discord.js';
import { db }          from "../index.js";
import type ForestBot  from '../structure/discord/Client.js';

export default {
    name: "guildDelete",
    once: false,
    execute: async (guild: Guild, client: ForestBot) => {
        console.log("I have left a guild: " + guild.id);
        await db.removeGuild(guild.id);
        await client.syncGuildCache();
    }
}