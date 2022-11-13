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
            color: color.Violet,
            title: "Help on commands and general setup.",
            fields: [
                {
                    name: "__/setup__",
                    value: `
                    *This command is used to set up the bot.*
                    \`\`\`/setup [mc server] [channel]\`\`\` 
                    > **mc server** - the minecraft server you want to use me for 
                    > **channel** - the channel you want my commands to work in (optional)
                    `,
                    inline: false
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: "__/livechat__",
                    value: `
                    *This command is used to setup a livechat bridge.* 
                    \`\`\`/livechat add [mc server] [channel]\`\`\` 
                    \`\`\`/livechat remove [channel] \`\`\`
                    **Adding a livechat** 
                    > **mc server** - the minecraft server you want the livechat for 
                    > **channel** - the channel you want the livechat to work in 
                    **Removing a livechat**
                    > **channel** - the channel you want to remove the livechat from
                    > **Note:** Livechats are limited to the servers that I am currently in.
                    `,
                    inline: false
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: "__/tablist__",
                    value: `
                    *This command is used to get a live tablist of a minecraft server.* 
                    \`\`\`/tablist\`\`\` 
                    `,
                    inline: false
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: "__/search__",
                    value: `
                    *This command is used to query all statistics stored on a user.* 
                    \`\`\`/search [user]\`\`\`
                    > **user** - the user you want to search for
                    > Gets playtime, joindate, lastseen, kills, deaths, and more. 
                    `,
                    inline: false
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: "__/quote__",
                    value: `
                    *This command is used to get a random message sent by a user.* 
                    \`\`\`/quote [user]\`\`\` 
                    > **user** - the user you want to quote.
                    `,
                    inline: false
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "https://forestbot.org"
            }
        }

        return interaction.reply({ embeds: [helpEmbed]})


    }
}