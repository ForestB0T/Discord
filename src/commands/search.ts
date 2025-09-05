import { CommandInteraction, MessageActionRow, MessageButton, Message } from "discord.js";
import { dhms } from "../utils/time/dhms.js";
import { timeAgoStr, convertUnixTimestamp } from "../utils/time/convert.js";
import type ForestBot from "../structure/discord/Client";
import { buildPlaytimeEmbed } from "../utils/embeds/playtimeGraph.js"; // <-- our reusable function

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "search",
        description: "Search a user's statistics",
        type: 1,
        options: [
            {
                name: "user",
                description: "User you want to lookup",
                type: 3,
                required: true
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {
        await interaction.deferReply();
        const user = interaction.options.getString("user", true);

        // Fetch UUID & stats
        const uuid = await client.API.convertUsernameToUuid(user);
        if (!uuid) return interaction.editReply(`❌ Could not find user: **${user}**`);
        const data = await client.API.getStatsByUuid(uuid, thisGuild.mc_server);
        if (!data) return interaction.editReply(`❌ No stats found for **${user}** on this server`);

        // Additional info
        const lastKill = await client.API.getKills(uuid, thisGuild.mc_server, 1, "DESC");
        const lastAdv = await client.API.getAdvancements(uuid, thisGuild.mc_server, 1, "DESC");
        const totalAdv = await client.API.getTotalAdvancementsCount(uuid, thisGuild.mc_server);
        const msgCount = await client.API.getMessageCount(user, thisGuild.mc_server);
        const quote = await client.API.getQuote(user, thisGuild.mc_server);

        const firstSeen = /^\d+$/.test(data.joindate)
            ? `${convertUnixTimestamp(parseInt(data.joindate))} (${timeAgoStr(parseInt(data.joindate))})`
            : "*Unknown*";
        const lastSeen = /^\d+$/.test(data.lastseen)
            ? `${convertUnixTimestamp(parseInt(data.lastseen))} (${timeAgoStr(parseInt(data.lastseen))})`
            : "*Unknown*";

        const lastDeath = data.lastdeathString
            ? `${data.lastdeathString} (${timeAgoStr(data.lastdeathTime)})`
            : "*No death recorded*";

        const lastKillStr = lastKill?.[0]
            ? `${lastKill[0].death_message} (${timeAgoStr(lastKill[0].time)})`
            : "*No kills recorded*";

        const lastAdvStr = lastAdv?.[0]
            ? `${lastAdv[0].advancement} (${timeAgoStr(lastAdv[0].time)})`
            : "*No advancements*";

        const engagement = (() => {
            if (!/^\d+$/.test(data.joindate) || !/^\d+$/.test(data.lastseen)) return null;
            const jd = parseInt(data.joindate);
            const ls = parseInt(data.lastseen);
            return ((data.playtime / (ls - jd)) * 100).toFixed(2);
        })();

        // Embed
        const embed = {
            title: `${user} • Profile`,
            color: 0x1a1a1a,
            description: `*Server: \`${thisGuild.mc_server}\`*`,
            thumbnail: { url: `https://mc-heads.net/avatar/${user}/100` },
            fields: [
                { name: "Kills", value: `${data.kills}`, inline: true },
                { name: "Deaths", value: `${data.deaths}`, inline: true },
                { name: "Joins", value: `${data.joins}`, inline: true },
                { name: "Playtime", value: `${dhms(data.playtime)}`, inline: true },
                { name: "Messages", value: `${msgCount.count}`, inline: true },
                { name: "Engagement", value: engagement ? `${engagement}%` : "N/A", inline: true },
                { name: "Last Kill", value: lastKillStr, inline: false },
                { name: "Last Death", value: lastDeath, inline: false },
                { name: "Last Advancement", value: lastAdvStr, inline: false },
                { name: "Total Advancements", value: `${totalAdv}`, inline: false },
                { name: "First Seen", value: firstSeen, inline: true },
                { name: "Last Seen", value: lastSeen, inline: true },
                { name: "Quote 💬", value: quote?.message || "*No quote yet*", inline: false }
            ],
            image: { url: `https://mc-heads.net/player/${user}` },
            footer: { text: "ForestBot • https://forestbot.org" },
            timestamp: new Date()
        };

        // Buttons
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`refreshQuote_${user}`)
                .setLabel("🔄 Refresh Quote")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId(`playtimeGraph_${user}_${thisGuild.mc_server}_1_week`)
                .setLabel("📊 View Playtime Graph")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setLabel("🌐 ForestBot")
                .setStyle("LINK")
                .setURL(`https://forestbot.org/u/${user}`),
            new MessageButton()
                .setLabel("🪪 NameMC")
                .setStyle("LINK")
                .setURL(`https://namemc.com/profile/${user}`)
        );

        // Send message
        const msg = await interaction.editReply({ embeds: [embed], components: [row] }) as Message;

        // Collector
        const collector = msg.createMessageComponentCollector({ time: 60_000 });
        collector.on("collect", async (btnInteraction) => {
            if (!btnInteraction.isButton()) return;

            // Refresh quote
            if (btnInteraction.customId.startsWith("refreshQuote")) {
                const newQuote = await client.API.getQuote(user, thisGuild.mc_server);
                embed.fields = embed.fields.map(f => f.name === "Quote 💬" ? { ...f, value: newQuote?.message || "*No quote yet*" } : f);
                await btnInteraction.update({ embeds: [embed] });
            }

            // Playtime graph
            if (btnInteraction.customId.startsWith("playtimeGraph")) {
                const { embed: graphEmbed } = await buildPlaytimeEmbed(client, thisGuild, user, "1_month");
                if (graphEmbed) await btnInteraction.update({ embeds: [graphEmbed] });
            }
        });
    }
};
