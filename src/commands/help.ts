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
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {
        const helpEmbed = {
            color: 0x4CAF50, // Soft green for a friendly look
            title: '📜 Help - Command List',
            description: 'Below are the commands you can use to interact with the bot. Each command includes its purpose and required parameters.',
            fields: [
                {
                    name: '**Commands**',
                    value: '\u200B',
                    inline: false,
                },

                // /search command
                {
                    name: '🔍 **/search**',
                    value: 'Query statistics about a specific user.',
                    inline: false,
                },
                {
                    name: 'Usage',
                    value: '`/search [user]`',
                    inline: true,
                },
                {
                    name: 'Parameters',
                    value: [
                        '**user** - The user to search for.\n',
                        'Displays information such as playtime, join date, last seen, kills, deaths, and more.'
                    ].join('\n'),
                    inline: false,
                },

                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },

                // /messages command
                {
                    name: '📨 **/messages**',
                    value: 'Retrieve all messages from a specific user.',
                    inline: false,
                },
                {
                    name: 'Usage',
                    value: '`/messages [user]`',
                    inline: true,
                },
                {
                    name: 'Parameters',
                    value: [
                        '**user** - The user whose messages you want to retrieve.\n',
                        'Displays the user’s message history with timestamps.'
                    ].join('\n'),
                    inline: false,
                },

                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },

                // /setup command
                {
                    name: '⚙️ **/setup**',
                    value: 'Configure the bot with an initial setup for your Minecraft server.',
                    inline: false,
                },
                {
                    name: 'Usage',
                    value: '`/setup [mc_server] (channel)`',
                    inline: true,
                },
                {
                    name: 'Parameters',
                    value: [
                        '**mc_server** - The Minecraft server to connect the bot to. (Required)\n',
                        '**channel** - Optional Discord channel where bot commands are allowed.'
                    ].join('\n'),
                    inline: false,
                },

                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },

                // /tablist command
                {
                    name: '📋 **/tablist**',
                    value: 'Get the live tablist of the Minecraft server.',
                    inline: false,
                },
                {
                    name: 'Usage',
                    value: '`/tablist`',
                    inline: true,
                },
                {
                    name: 'Parameters',
                    value: 'No parameters required.',
                    inline: false,
                },

                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },

                // /livechat command
                {
                    name: '💬 **/livechat**',
                    value: 'Get a live chat feed of the Minecraft server in a Discord channel.',
                    inline: false,
                },
                {
                    name: 'Usage',
                    value: '`/livechat [mc_server] (channel)`',
                    inline: true,
                },
                {
                    name: 'Parameters',
                    value: [
                        '**mc_server** - The Minecraft server to get the chat feed from. (Required)\n',
                        '**channel** - The Discord channel to post the live chat feed. (Required)'
                    ].join('\n'),
                    inline: false,
                },

                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: false,
                },

                {
                    name: 'Additional Information',
                    value: `ForestBot is a player ran Bot made on February 28th 2021, by Febzey. \n
                        The bot is designed to track player statistics, messages, and anything else a regular user can see, some statistics may not be 100% accurate. \n
                        ForestBot is able to be setup on any Minecraft server, and can be configured to post live chat messages to a Discord channel. \n
                    `,
                    inline: false,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: 'https://forestbot.org',
                icon_url: 'https://forestbot.org/favicon.ico',
            },
        };


        return interaction.reply({ embeds: [helpEmbed] })


    }
}