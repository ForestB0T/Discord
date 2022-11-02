import { CommandInteraction } from 'discord.js';
import { color } from '../index.js';
import fetchData from '../fuctions/fetch.js';
import type ForestBot from '../structure/discord/Client';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "quote",
        description: "quote a user",
        type: 1,
        options: [
            {
                name: "user",
                description: "user you want to quote",
                type: 3,
                required: true
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {
        let userToSearch = interaction.options.getString("user")

        await interaction.deferReply();

        type User = {
            name: string,
            message: string,
            date: string
            error?: string
        }

        let data = await fetchData(`${client.apiUrl}/quote/${userToSearch}/${thisGuild.mc_server}`) as User;

        if (data.error) {
            return await interaction.editReply({
                content: `> Could not find user: **${userToSearch}**`
            })
        }

        const quoteEmbed: {} = {
            color: color.Emerald,
            description: `> **${userToSearch}** » ${data.message}`,
        }

        return await interaction.editReply({
            embeds: [quoteEmbed] 
        });

    }
}