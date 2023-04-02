import { Interaction, Guild } from 'discord.js';
import { api }          from "../index.js";
import type ForestBot  from '../structure/discord/Client.js';

export default {
    name: "guildDelete",
    once: false,
    execute: async (guild: Guild, client: ForestBot) => {
        console.log("I have left a guild: " + guild.id);
        await api.removeGuild({ guild_id: guild.id});
        await client.syncGuildCache();
    }
}