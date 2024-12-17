import { CommandInteraction, Message } from 'discord.js';
import type ForestBot from '../structure/discord/Client';
import createPlaytimeGraph from '../utils/graphMaker.js';

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
                type: 3, // USER type
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
        const user = interaction.options.getString("user");
        const duration = interaction.options.getString("duration");

        await interaction.deferReply();

        const uuid = await client.API.convertUsernameToUuid(user);
        const graphData = await fetch(`http://localhost:8001/player/playtime?uuid=${uuid}&date=${Date.now()}&server=${thisGuild.mc_server}&duration=${duration}`).then(res => res.json());
        const graphDataMap = new Map<string, number>();

        //lets create up some other neat stats from this data
        let totalPlaytime = 0;
        let averagePlaytime = 0;
        let maxPlaytime = 0;
        let minPlaytime = Infinity;
        let maxPlaytimeDate = "";
        let minPlaytimeDate = "";


        // Populate graphDataMap with provided playtime data
        graphData.forEach(day => {
            totalPlaytime += day.playtime;
            if (day.playtime > maxPlaytime) {
                maxPlaytime = day.playtime;
                maxPlaytimeDate = day.day;
            }
            if (day.playtime < minPlaytime) {
                minPlaytime = day.playtime;
                minPlaytimeDate = day.day;
            }
            totalPlaytime += day.playtime;
            const formattedDate = new Date(day.day).toISOString().split('T')[0];
            graphDataMap.set(formattedDate, day.playtime);
        });

        averagePlaytime = totalPlaytime / graphData.length;

        const totalPlaytimeString = `${Math.floor(totalPlaytime / 60)} hours and ${Math.floor(totalPlaytime % 60)} minutes`;
        const averagePlaytimeString = `${Math.floor(averagePlaytime / 60)} hours and ${Math.floor(averagePlaytime % 60)} minutes`;

        
        
        // Fill in missing days with 0 playtime
        const filledGraphData = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (duration === "1_week" ? 7 : 30));
        
        for (let d = startDate; d <= new Date(); d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            filledGraphData.push({
                date: dateStr,
                playtime: graphDataMap.get(dateStr) || 0
            });
        }
            
        filledGraphData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (!graphData || !uuid) {
            await interaction.editReply({
                content: `> Could not find user: **${user}**`,
            });

            setTimeout(async () => {
                await interaction.deleteReply();
            }, 10000);

            return;
        }

        const graph = await createPlaytimeGraph(filledGraphData);

        await interaction.editReply({
            embeds: [
                {
                    title: "📊 Playtime Graph",
                    description: `
                    **User:** ${user}
                    **Duration:** ${duration.replace('_', ' ')}
                    **Server:** ${thisGuild.mc_server}
                    **Total Playtime** ${totalPlaytimeString}
                    **Average Playtime** ${averagePlaytimeString}
                    **Day with most playtime:** ${maxPlaytimeDate} with ${maxPlaytime} minutes
                    **Day with least playtime:** ${minPlaytimeDate} with ${minPlaytime} minutes
                    `,
                    color: 0x00AE86,
                    image: {
                        url: 'attachment://graph.png',  // Reference the file sent in the 'files' array
                    },
                    timestamp: new Date()
                }
            ],
            files: [
                {
                    attachment: graph,  // 'graph' is the buffer from the chart generation
                    name: 'graph.png'
                }
            ]
        });

    }
}
