import ForestBot from "../structure/discord/Client";
import { color } from "../index.js";
import {
    CommandInteraction,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
} from "discord.js";
import { timeAgoStr } from "../utils/time/convert.js";



const fakeAdvancementsData = {
    advancements: [
        {
            username: "player1",
            advancement: "[Stone Age]",
            time: 1639491895000,
            mc_server: "example_server",
            id: 1,
            uuid: "uuid1",
          },
          {
            username: "player1",
            advancement: "[Getting Wood]",
            time: 1639491995000,
            mc_server: "example_server",
            id: 2,
            uuid: "uuid1",
          },
          {
            username: "player2",
            advancement: "[Acquire Hardware]",
            time: 1639492095000,
            mc_server: "example_server",
            id: 3,
            uuid: "uuid2",
          },
          {
            username: "player2",
            advancement: "[Time to Farm]",
            time: 1639492195000,
            mc_server: "example_server",
            id: 4,
            uuid: "uuid2",
          },
          {
            username: "player3",
            advancement: "[Monster Hunter]",
            time: 1639492295000,
            mc_server: "example_server",
            id: 5,
            uuid: "uuid3",
          },
          {
            username: "player3",
            advancement: "[Cow Tipper]",
            time: 1639492395000,
            mc_server: "example_server",
            id: 6,
            uuid: "uuid3",
          },
          {
            username: "player4",
            advancement: "[Bake Bread]",
            time: 1639492495000,
            mc_server: "example_server",
            id: 7,
            uuid: "uuid4",
          },
          {
            username: "player4",
            advancement: "[The Lie]",
            time: 1639492595000,
            mc_server: "example_server",
            id: 8,
            uuid: "uuid4",
          },
          {
            username: "player5",
            advancement: "[Getting an Upgrade]",
            time: 1639492695000,
            mc_server: "example_server",
            id: 9,
            uuid: "uuid5",
          },
          {
            username: "player5",
            advancement: "[Hot Topic]",
            time: 1639492795000,
            mc_server: "example_server",
            id: 10,
            uuid: "uuid5",
          },
          {
            username: "player6",
            advancement: "[Delicious Fish]",
            time: 1639492895000,
            mc_server: "example_server",
            id: 11,
            uuid: "uuid6",
          },
          {
            username: "player6",
            advancement: "[On A Rail]",
            time: 1639492995000,
            mc_server: "example_server",
            id: 12,
            uuid: "uuid6",
          },
          {
            username: "player7",
            advancement: "[Time to Strike]",
            time: 1639493095000,
            mc_server: "example_server",
            id: 13,
            uuid: "uuid7",
          },
          {
            username: "player7",
            advancement: "[Time to Mine]",
            time: 1639493195000,
            mc_server: "example_server",
            id: 14,
            uuid: "uuid7",
          },
          {
            username: "player8",
            advancement: "[A Balanced Diet]",
            time: 1639493295000,
            mc_server: "example_server",
            id: 15,
            uuid: "uuid8",
          },
          {
            username: "player8",
            advancement: "[Adventuring Time]",
            time: 1639493395000,
            mc_server: "example_server",
            id: 16,
            uuid: "uuid8",
          },
          {
            username: "player9",
            advancement: "[Have a Shearful Day]",
            time: 1639493495000,
            mc_server: "example_server",
            id: 17,
            uuid: "uuid9",
          },
          {
            username: "player9",
            advancement: "[Hot Pursuit]",
            time: 1639493595000,
            mc_server: "example_server",
            id: 18,
            uuid: "uuid9",
          },
          {
            username: "player10",
            advancement: "[What a Deal!]",
            time: 1639493695000,
            mc_server: "example_server",
            id: 19,
            uuid: "uuid10",
          },
          {
            username: "player10",
            advancement: "[Trade]",
            time: 1639493795000,
            mc_server: "example_server",
            id: 20,
            uuid: "uuid10",
          },
    ]
};



const advancementPages = {} as { [key: string]: number };
const advancementMaxLength = 100;
let advancementsLength = 0;
const interactionMap = new Map();

const getAdvancementRow = (id: string) => {
    const row = new MessageActionRow();
    row.addComponents(
        new MessageButton()
            .setCustomId("prev_advancements")
            .setStyle("SECONDARY")
            .setEmoji("⏮")
            .setDisabled(advancementPages[id] === 0)
    );
    row.addComponents(
        new MessageButton()
            .setCustomId("next_advancements")
            .setStyle("SECONDARY")
            .setEmoji("⏭")
            .setDisabled(advancementsLength < sliceLimit)
    );

    return row;
};




//lets just fetch all advancements and store them in local variable when command is initiated.




let sliceLimit = 0;

async function createAdvancementEmbed(limit: number, mc_server: string, username: string, id: string): Promise<MessageEmbed> {

    try {
        const data = fakeAdvancementsData

        advancementsLength = data.advancements.length;

        const embed = new MessageEmbed()
            .setColor(color.Yellow)
            .setTitle(`Advancements for ${username} (Page: ${advancementPages[id]})`)
            .setDescription(`Page`)
            .setTimestamp()
            .setFooter({
                text: `Page: ${advancementPages[id]} | Page Limit: ${advancementMaxLength}`,
            });

        if (data && sliceLimit < data.advancements.length) {


            console.log(data.advancements.length, " # of advancements")
            console.log(advancementPages[id], " page #");
            console.log(sliceLimit, " which index to slice")

            const slicedData = data.advancements.slice(sliceLimit,sliceLimit+8);

            console.log(slicedData);
            console.log(sliceLimit + " ", sliceLimit + 8);

            const formattedAdvancements = slicedData.map(({ advancement, time }) => {
                return `\n \x1b[0m${advancement.replace(/.*?(\[.*?\]).*/g, '\x1b[1;33m$1\x1b[0m')} ${timeAgoStr(Number(time))}`;
            });


            embed.setDescription(`\`\`\`ansi${formattedAdvancements.join("\n")}
            \`\`\`\
            `);

        } else {
            embed.setDescription(
                "No advancements found. Try using a different search criteria."
            );
        }

        return embed;

        
    } catch (error) {
        console.error("Error in createAdvancementEmbed:", error);
        throw error;
    }
}














export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "advancements",
        description: "See a user's recent advancements",
        type: 1,
        options: [
            {
                name: "user",
                description: "The user whose advancements you would like to view.",
                type: 3,
                required: true,
            },
        ],
    },
    run: async (
        interaction: CommandInteraction,
        _client: ForestBot,
        thisGuild: Guild
    ) => {
        try {
            const username = interaction.options.getString("user");
            const userId = interaction.user.id;

            if (interactionMap.has(userId)) {
                interactionMap.delete(userId);
            } else {
                interactionMap.set(userId, true);
            }

            let lastAdvancementLimit = advancementMaxLength;
            
            const user = interaction.user;
            const channel = interaction.channel;
            const id = user.id;

            advancementPages[id] = advancementPages[id] || 0;

            let collector;
            const filter = (i: Interaction) => i.user.id === user.id;
            const time = 1000 * 60 * 5;

            // Defer the reply here
            await interaction.deferReply();

            const firstPageAdvancementsEmbed = await createAdvancementEmbed(
                lastAdvancementLimit,
                thisGuild.mc_server,
                username,
                id
            );

            await interaction.editReply({
                embeds: [firstPageAdvancementsEmbed],
                components: [getAdvancementRow(id)],
            });

            collector = channel.createMessageComponentCollector({
                filter,
                time,
                message: await interaction.fetchReply(),
            });


            /**
             * Handling the button clicks.
             */
            collector.on("collect", async (btnInt: MessageComponentInteraction) => {
                if (!btnInt) return;

                btnInt.deferUpdate();

                if (btnInt.user.id !== userId) return;

                if (
                    btnInt.customId !== "prev_advancements" &&
                    btnInt.customId !== "next_advancements"
                )
                    return;

                let otherPagesAdvancementsEmbed: MessageEmbed;

                if (
                    btnInt.customId === "prev_advancements" &&
                    advancementPages[id] > 0
                ) {
                    sliceLimit = sliceLimit - 8;
                    --advancementPages[id];
                    if (lastAdvancementLimit >= advancementMaxLength) {
                        lastAdvancementLimit = lastAdvancementLimit - advancementMaxLength;
                    }

                    otherPagesAdvancementsEmbed = await createAdvancementEmbed(
                        lastAdvancementLimit,
                        thisGuild.mc_server,
                        username,
                        id
                    );
                }

                else if (btnInt.customId === "next_advancements" && advancementPages[id] < advancementMaxLength - 1) {
                    sliceLimit = sliceLimit + 8
                    ++advancementPages[id];

                    lastAdvancementLimit = lastAdvancementLimit + advancementMaxLength;

                    otherPagesAdvancementsEmbed = await createAdvancementEmbed(
                        lastAdvancementLimit,
                        thisGuild.mc_server,
                        username,
                        id
                    );

                }

                await interaction.editReply({
                    embeds: [otherPagesAdvancementsEmbed],
                    components: [getAdvancementRow(id)],
                });

            });


        } catch (error) {
            await interaction.followUp({
                ephemeral: true,
                content:
                    "An unknown error occurred. Please contact Febzey#1854",
            });

            console.error(error, "error in advancements.ts");
            return;
        }
    },
};