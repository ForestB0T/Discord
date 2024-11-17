import { CommandInteraction } from 'discord.js';
import type ForestBot from '../structure/discord/Client';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "commands",
        description: "In game commands",
        type: 1
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {

        const commandsEmbed = {
            color: 0x4CAF50, // Soft green for a friendly look
            title: '📜 In-game Command list.',
            description: 'Below are the commands you can use to interact with the bot. Each command includes its purpose and required parameters.',
            fields: [
                {
                    name: "General Commands",
                    value: "!addfaq\n!coords\n!discord\n!faq\n!help\n!iam",
                    inline: false
                },
                {
                    name: "Player Stats Commands",
                    value: "!joindate\n!joins\n!kd\n!playtime\n!lastkill\n!lastdeath",
                    inline: false
                },
                {
                    name: "Chat and Messaging Commands",
                    value: "!firstmessage\n!offlinemsg\n!lastmessage\n!msgcount\n!wordcount",
                    inline: false
                },
                {
                    name: "Utility Commands",
                    value: "!advancements\n!lastadvancement\n!lastseen\n!sleep\n!top",
                    inline: false
                },
                {
                    name: "Fun Commands",
                    value: "!quote\n!mount\n!whois",
                    inline: false
                },
                {
                    name: "Command Descriptions",
                    value: "Adds a new FAQ entry. Usage: `!addfaq <text>`\n" +
                        "Use `!coords` to get the coordinates of the bot.\n" +
                        "Shares the Discord server invite link. Usage: `!discord`\n" +
                        "Retrieves a FAQ entry by ID. Usage: `!faq <id>`\n" +
                        "Use `!help` to get the help message.\n" +
                        "Use `!iam` to set your `!whois` description.\n\n" +

                        "Retrieves the join date of a user. Usage: `!joindate <username>`\n" +
                        "Shows the number of times a user has joined. Usage: `!joins <username>`\n" +
                        "Displays the kill/death ratio of a user. Usage: `!kd <username>`\n" +
                        "Retrieves the total playtime of a user. Usage: `!playtime <username>`\n" +
                        "Retrieves the last kill a user got. Usage: `!lastkill <username>`\n" +
                        "Retrieves the last death of a user. Usage: `!lastdeath <username>`\n\n"
                },
                {
                    name: " ",
                    value: "Retrieves the first message of a user. Usage: `!firstmessage <username>`\n" +
                        "Send a message to a user who is offline. Usage: `!offlinemsg <username> <text>`\n" +
                        "Retrieves the last message of a user. Usage: `!lastmessage <username>`\n" +
                        "Retrieves the number of messages a user has sent. Usage: `!msgcount <username>`\n" +
                        "Shows how many times a user has said a word. Usage: `!wordcount <username> <word>`\n\n" +

                        "Retrieves the number of advancements a user has. Usage: `!advancements <username>`\n" +
                        "Retrieves the most recent advancement of a user. Usage: `!lastadvancement <username>`\n" +
                        "Displays the last time a user was seen online. Usage: `!lastseen <username>`\n" +
                        "Put the bot to sleep. Usage: `!sleep`\n" +
                        "Shows the top players for a specific stat. Usage: `!top <kills/deaths/joins/playtime>`\n\n" +

                        "Retrieves a random quote from a user. Usage: `!quote <username>`\n" +
                        "Use `!mount` to mount the nearest boat.\n" +
                        "Shows the description of a user. Usage: `!whois <username>`"
                }
            ],
            footer: {
                text: "Use these commands in-game to interact with the bot!"
            }
        }


        return interaction.reply({ embeds: [commandsEmbed] })


    }
}