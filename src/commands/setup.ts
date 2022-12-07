import { CommandInteraction } from 'discord.js';
import { getNameFromDomain } from '../utils/checkString.js';
import type ForestBot         from '../structure/discord/Client';
import { db }                 from "../index.js";

export default {
    permissions: "MANAGE_GUILD",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "setup",
        description: "set me up for the server you use me for.",
        type: 1,
        options: [
            {
                name: "mcserver",
                description: "the minecraft server you use me for",
                type: 3,
                required: true
            },
            {
                name: "channel",
                description: "channel you want to use me in, this is optional",
                type: 7,
                required: false
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {

        let mcserver     = interaction.options.getString("mcserver");
        const channel    = interaction.options.getChannel("channel");
        const user       = interaction.user.username;
        const guild_id   = interaction.guild.id;
        const guild_name = interaction.guild.name;

        mcserver = getNameFromDomain(mcserver); 

        if (channel && channel.type !== "GUILD_TEXT") {
            return interaction.reply({
                content: "> The channel you specified is not a text channel.",
                ephemeral: true
            })
        }

        try {
      
            await db.addGuild({
                guild_id,
                channel_id: channel ? channel.id : null,
                mc_server: mcserver,
                setup_by: user,
                created_at: Date.now(),
                guild_name
            })

            return interaction.reply({
                content: `> I am now setup for the server **${mcserver}**. ${channel ? `My commands will work in the channel: <#${channel.id}>` : ""}`,
                ephemeral: true
            })

        } 
        catch (err) {

            return interaction.reply({
                content: "> An error occured while setting up the server.",
                ephemeral: true
            })
        }
    }
}