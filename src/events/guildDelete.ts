import { Interaction, Guild } from 'discord.js';
import type ForestBot  from '../structure/discord/Client.js';

export default {
    name: "guildDelete",
    once: false,
    execute: async (guild: Guild, client: ForestBot) => {
        console.log("I have left a guild: " + guild.id);
        client.sendMessageToSudoChannel(`I have left a guild: **${guild.name}** (${guild.id})`);
        await client.API.removeGuild({ guild_id: guild.id});
        await client.syncGuildCache();
    }
}