import { Interaction, Guild } from 'discord.js';
import type ForestBot  from '../structure/discord/Client.js';

export default {
    name: "guildCreate",
    once: false,
    execute: async (guild: Guild, client: ForestBot) => {
        console.log("I have Joined a guild " + guild.id);
        client.sendMessageToSudoChannel(`I have joined a guild: **${guild.name}** (${guild.id})`);
        await client.syncGuildCache();
    }
}