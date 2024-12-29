import { CommandInteraction } from 'discord.js';
import type ForestBot from '../structure/discord/Client';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "help",
        description: "Get help on how to set me up",
        type: 1
    },
    run: async (interaction: CommandInteraction) => {
        const helpEmbed = {
            color: 0x4CAF50, // Soft green for a friendly look
            title: '📜 Help - Command List',
            description: 'Commands you can use to interact with the bot:',
            fields: [
                {
                    name: '🔍 **/search [user]**',
                    value: 'Query statistics about a specific user.',
                    inline: false,
                },
                {
                    name: '📨 **/messages [user]**',
                    value: 'Retrieve all messages from a specific user.',
                    inline: false,
                },
                {
                    name: '⚙️ **/setup [mc_server] (channel)**',
                    value: 'Configure the bot with an initial setup for your Minecraft server.',
                    inline: false,
                },
                {
                    name: '📋 **/tablist**',
                    value: 'Get the live tablist of the Minecraft server.',
                    inline: false,
                },
                {
                    name: '💬 **/livechat [mc_server] (channel)**',
                    value: 'Get a live chat feed of the Minecraft server in a Discord channel.',
                    inline: false,
                },
                {
                    name: '📋 **/invite**',
                    value: 'Get an invite link for ForestBot.',
                    inline: false,
                },
                {
                    name: '👀 **/watcher add|remove <user>**',
                    value: 'Notify you when a user joins the server.',
                    inline: false,
                },
                {
                    name: '📊 **/playtimegraph [user]**',
                    value: 'Generate a playtime graph for a specific user.',
                    inline: false,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: 'https://forestbot.org',
                icon_url: 'https://forestbot.org/favicon.ico',
            },
        };

        return interaction.reply({ embeds: [helpEmbed] });
    }
}
