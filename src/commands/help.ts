import { CommandInteraction } from 'discord.js';
import type ForestBot         from '../structure/discord/Client';
import { color } from "../index.js";

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
            color: color.Green,
            title: "Help on Commands and General Setup",
            description: "Below are commands and setup instructions for using the bot.",
            fields: [
                {
                    name: "__/setup__",
                    value: "This command is used to set up the bot.\nExample: `/setup simplyvanilla`",
                    inline: false,
                },
                {
                    name: "Usage:",
                    value: "/setup [mc server] [channel]",
                    inline: false,
                },
                {
                    name: "Parameters:",
                    value: "> **mc server** - the Minecraft server for bot usage\n> **channel** - the command channel (optional)",
                    inline: false,
                },
                {
                    name: "\u200B",
                    value: "\u200B",
                    inline: false,
                },
                {
                    name: "__/livechat__",
                    value: "Setup a livechat bridge or remove an existing one.",
                    inline: false,
                },
                {
                    name: "Usage:",
                    value: "/livechat add [mc server] [channel]\n/livechat remove [channel]",
                    inline: false,
                },
                {
                    name: "Adding a Livechat:",
                    value: "> **mc server** - the Minecraft server\n> **channel** - the livechat channel",
                    inline: false,
                },
                {
                    name: "Removing a Livechat:",
                    value: "> **channel** - the channel to remove the livechat from\nNote: Livechats are limited to the servers the bot is in.",
                    inline: false,
                },
                {
                    name: "\u200B",
                    value: "\u200B",
                    inline: false,
                },
                {
                    name: "__/tablist__",
                    value: "Get a live tablist of a Minecraft server.",
                    inline: false,
                },
                {
                    name: "Usage:",
                    value: "/tablist",
                    inline: false,
                },
                {
                    name: "\u200B",
                    value: "\u200B",
                    inline: false,
                },
                {
                    name: "__/search__",
                    value: "Query statistics stored on a user.",
                    inline: false,
                },
                {
                    name: "Usage:",
                    value: "/search [user]",
                    inline: false,
                },
                {
                    name: "Parameters:",
                    value: "> **user** - the user to search for\nGets playtime, joindate, lastseen, kills, deaths, and more.",
                    inline: false,
                },
                {
                    name: "\u200B",
                    value: "\u200B",
                    inline: false,
                },
                {
                    name: "__/messages__",
                    value: "Get all messages from a user.",
                    inline: false,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: "Visit https://forestbot.org for more information.",
            }
        };
        

        return interaction.reply({ embeds: [helpEmbed]})


    }
}