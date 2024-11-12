import ForestBot from "../structure/discord/Client";
import { client, color } from "../index.js";
import { CommandInteraction, Interaction, InteractionCollector, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';
import { timeAgoStr } from "../utils/time/convert.js";
import apiHandler from "../structure/api/forestapi";


const pages = {} as { [key: string]: number }; // { userId: pageNumber }
const interactionMap = new Map();
let maxLength = 20;

const getRow = (id: string) => {
    const row = new MessageActionRow();
    row.addComponents(
        new MessageButton()
            .setCustomId("prev_embed")
            .setStyle("SECONDARY")
            .setEmoji("⏮")
            .setDisabled(pages[id] === 0)
    );
    row.addComponents(
        new MessageButton()
            .setCustomId("next_embed")
            .setStyle("SECONDARY")
            .setEmoji("⏭")
            .setDisabled(pages[id] === maxLength - 1)
    );

    return row;
};

async function createMessageEmbed(
    limit: number,
    mc_server: string,
    username: string,
    id: string
): Promise<MessageEmbed> {
    try {
        const messages = await client.API.getMessages(username, mc_server, limit, "DESC");

        const embed = new MessageEmbed()
            .setColor(color.Blue)
            .setTitle(`Messages for ${username} (Page: ${pages[id]})`)
            .setDescription(`Page`)
            .setTimestamp()
            .setFooter({ text: `Page: ${pages[id]} | Page Limit: ${maxLength}` });

        if (messages && messages.length > 0) {
            const formattedMessages = messages.map(({ name, message: content, date }) => `**${timeAgoStr(Number(date))}** ${content}`);
            embed.setDescription(formattedMessages.join("\n"));
        } else {
            embed.setDescription("No messages found. Try using a different search criteria.");
        }

        return embed;  // Return the MessageEmbed

    } catch (error) {
        console.error("Error in createMessageEmbed:", error);
        throw error;  // Re-throw the error to be caught in the calling code
    }
}

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "messages",
        description: "get messages from a specific user.",
        type: 1,
        options: [
            {
                name: "user",
                description: "user you want to lookup",
                type: 3,
                required: true
            }
        ]
    },
    run: async (
        interaction: CommandInteraction,
        client: apiHandler,
        thisGuild: Guild
    ) => {
        try {
            let username = interaction.options.getString("user");
            const userId = interaction.user.id;

            if (interactionMap.has(userId)) {
                interactionMap.delete(userId);
                // Remove the user's ID from the Map

            } else {
                interactionMap.set(userId, true);
            }

            let lastMessageLimit = 20;
            const user = interaction.user;
            const channel = interaction.channel;
            const id = user.id;
            pages[id] = pages[id] || 0;

            let collector;
            const filter = (i: Interaction) => i.user.id === user.id;
            const time = 1000 * 60 * 5;

            await interaction.deferReply(); // Defer the reply here

            const firstPageMessagesEmbed = await createMessageEmbed(
                lastMessageLimit,
                thisGuild.mc_server,
                username,
                id
            );

            await interaction.editReply({
                embeds: [firstPageMessagesEmbed],
                components: [getRow(id)],
            });

            collector = channel.createMessageComponentCollector({
                filter,
                time,
                message: await interaction.fetchReply()
            });

            collector.on("collect", async (btnInt: MessageComponentInteraction) => {
                if (!btnInt) return;

                btnInt.deferUpdate();

                if (btnInt.user.id !== userId) return;

                if (btnInt.customId !== "prev_embed" && btnInt.customId !== "next_embed") return;

                let otherPagesEmbed: MessageEmbed;

                if (btnInt.customId === "prev_embed" && pages[id] > 0) {
                    --pages[id];
                    if (lastMessageLimit >= 20) lastMessageLimit = lastMessageLimit - 20;
                    otherPagesEmbed = await createMessageEmbed(
                        lastMessageLimit,
                        thisGuild.mc_server,
                        username,
                        id
                    );
                } else if (btnInt.customId === "next_embed" && pages[id] < maxLength - 1) {
                    ++pages[id];
                    lastMessageLimit = lastMessageLimit + 20;
                    otherPagesEmbed = await createMessageEmbed(
                        lastMessageLimit,
                        thisGuild.mc_server,
                        username,
                        id
                    );
                }

                await interaction.editReply({
                    embeds: [otherPagesEmbed],
                    components: [getRow(id)],
                });
            });
        } catch (error) {
            await interaction.reply({
                ephemeral: true,
                content: "An unknown error occurred. Please contact Febzey#1854"
            });

            console.error(error, "error in messages.ts");
            return;
        }
    },
};