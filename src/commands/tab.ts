import { CommandInteraction } from 'discord.js';
import makeTablistEmbed       from '../utils/embeds/make_tablist_embed.js';
import type ForestBot         from '../structure/discord/Client';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "tablist",
        description: "Get a live tablist for the minecraft server you use me for",
        type: 1
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {   
    
        await interaction.deferReply();
        await interaction.editReply(await makeTablistEmbed(thisGuild.mc_server.toLowerCase(), "refresh"));
        return;

    }
}