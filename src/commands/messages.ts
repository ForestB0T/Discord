import ForestBot from "../structure/discord/Client";
import { client, color } from "../index.js";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageComponentInteraction, TextChannel } from "discord.js";
import { timeAgoStr } from "../utils/time/convert.js";
import apiHandler from "../structure/api/forestapi";

const userPages = new Map<string, number>(); // Tracks current page per user


function createRow(currentPage: number, maxPage: number) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("prev_embed")
                .setLabel("Previous")
                .setStyle("SECONDARY")
                .setDisabled(currentPage === 0),
            new MessageButton()
                .setCustomId("next_embed")
                .setLabel("Next")
                .setStyle("SECONDARY")
                .setDisabled(currentPage >= maxPage - 1)
        );
    return row;
}

async function createMessageEmbed(
    api: apiHandler,
    username: string,
    mc_server: string,
    page: number,
    pageSize: number
) {
    const offset = page * pageSize;
    const messages = await client.API.getMessages(username, mc_server, pageSize, "DESC", offset);

    const embed = new MessageEmbed()
        .setColor("#5865F2") // Discord blurple
        .setTitle(`Messages for ${username}`)
        .setDescription(messages.length === 0 ? "No messages found." : "")
        .setFooter({ text: `Page ${page + 1}` })
        .setTimestamp();

    if (messages.length > 0) {
        const formatted = messages.map(
            m => `**[${timeAgoStr(Number(m.date))}]** ${m.message}`
        ).join("\n");

        embed.setDescription(formatted);
    }

    return embed;
}
export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "messages",
        description: "Get messages from a specific user.",
        options: [
            {
                name: "user",
                description: "User you want to lookup",
                type: 3, // STRING type
                required: true
            }
        ]
    },
    run: async (interaction: CommandInteraction, api: apiHandler, thisGuild: any) => {
        const username = interaction.options.getString("user");
        const userId = interaction.user.id;
        const pageSize = 20;

        if (!username) return;

        userPages.set(userId, 0);

        await interaction.deferReply();

        const embed = await createMessageEmbed(api, username, thisGuild.mc_server, 0, pageSize);

        const message = await interaction.editReply({
            embeds: [embed],
            components: [createRow(0, 1000)]
        });

        const collector = (interaction.channel as TextChannel).createMessageComponentCollector({
            filter: (btn: MessageComponentInteraction) => btn.user.id === userId,
            time: 1000 * 60 * 5
        });

        collector.on("collect", async (btn: MessageComponentInteraction) => {
            let currentPage = userPages.get(userId) || 0;

            if (btn.customId === "prev_embed") currentPage = Math.max(currentPage - 1, 0);
            else if (btn.customId === "next_embed") currentPage += 1;
            else return;

            userPages.set(userId, currentPage);

            const newEmbed = await createMessageEmbed(api, username, thisGuild.mc_server, currentPage, pageSize);

            await btn.update({
                embeds: [newEmbed],
                components: [createRow(currentPage, 1000)]
            });
        });

        collector.on("end", () => {
            userPages.delete(userId);
        });
    }
};