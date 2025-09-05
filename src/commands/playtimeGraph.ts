import { CommandInteraction } from 'discord.js';
import type ForestBot from '../structure/discord/Client.js';
import { buildPlaytimeEmbed } from '../utils/embeds/playtimeGraph.js';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: false,
    requires_setup: true,
    data: {
        name: "playtimegraph",
        description: "Generate a playtime graph for a user",
        type: 1,
        options: [
            {
                name: "user",
                description: "The user to generate the graph for",
                type: 3, // STRING type
                required: true
            },
            {
                name: "duration",
                description: "The duration for the graph",
                type: 3, // STRING type
                required: true,
                choices: [
                    { name: "1 week", value: "1_week" },
                    { name: "1 month", value: "1_month" },
                ]
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {
        await interaction.deferReply();

        const user = interaction.options.getString("user")!;
        const duration = interaction.options.getString("duration")!;
        const uuid = await client.API.convertUsernameToUuid(user);

        if (!uuid) {
            return interaction.editReply(`> Could not find user: **${user}**`);
        }

        const { embed } = await buildPlaytimeEmbed(client, thisGuild, user, duration as "1_week"||"1_month") || {};
        if (!embed) {
            return interaction.editReply(`> No playtime data found for **${user}** on this server.`);
        }
        return interaction.editReply({ embeds: [embed] });
//         // Fetch playtime data
//         const graphData = await fetch(
//             `http://localhost:8001/player/playtime?uuid=${uuid}&date=${Date.now()}&server=${thisGuild.mc_server}&duration=${duration}`
//         ).then(res => res.json());

//         // Prepare data for chart
//         const labels: string[] = [];
//         const values: number[] = [];
//         let totalPlaytime = 0;
//         let maxPlaytime = 0;
//         let minPlaytime = Infinity;
//         let maxPlaytimeDate = "";
//         let minPlaytimeDate = "";

//         const startDate = new Date();
//         startDate.setDate(startDate.getDate() - (duration === "1_week" ? 6 : 29)); // include today

//         for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
//             const dateStr = d.toISOString().split("T")[0];
//             const dayData = graphData.find((x: any) => x.day === dateStr);
//             const playtime = dayData ? dayData.playtime : 0;

//             labels.push(dateStr);
//             values.push(playtime);

//             totalPlaytime += playtime;
//             if (playtime > maxPlaytime) {
//                 maxPlaytime = playtime;
//                 maxPlaytimeDate = dateStr;
//             }
//             if (playtime < minPlaytime) {
//                 minPlaytime = playtime;
//                 minPlaytimeDate = dateStr;
//             }
//         }

//         const averagePlaytime = Math.round(totalPlaytime / values.length);

//         const formatTime = (mins: number) =>
//             `${Math.floor(mins / 60)}h ${Math.floor(mins % 60)}m`;

//         // Build QuickChart URL
//         const chartConfig = {
//             type: 'line',
//             data: {
//                 labels,
//                 datasets: [{
//                     label: 'Playtime (minutes)',
//                     data: values,
//                     fill: true,
//                     backgroundColor: 'rgba(0,174,134,0.2)',
//                     borderColor: '#00AE86',
//                     tension: 0.3
//                 }]
//             },
//             options: {
//                 plugins: { legend: { display: false } },
//                 scales: {
//                     y: { beginAtZero: true }
//                 }
//             }
//         };
//         const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

//         // Send embed
// await interaction.editReply({
//     embeds: [
//         {
//             title: `📊 ${user} — Playtime Stats`,
//             description: `
// **Server:** ${thisGuild.mc_server}  
// **Duration:** ${duration.replace('_', ' ')}  

// 🕒 **Total Playtime:** ${formatTime(totalPlaytime)}  
// ⏱ **Average Playtime:** ${formatTime(averagePlaytime)}  
// 📈 **Most Playtime:** ${maxPlaytimeDate} (${maxPlaytime} min)  
// 📉 **Least Playtime:** ${minPlaytimeDate} (${minPlaytime} min)  

// _Use the chart below to see daily activity_
//             `,
//             color: 0x1F1F1F, // dark sleek look
//             image: { url: chartUrl },
//             thumbnail: { url: `https://mc-heads.net/avatar/${user}/70` },
//             footer: { text: `Playtime stats for ${user}` },
//             timestamp: new Date()
//         }
//     ]
// });


    }
};
