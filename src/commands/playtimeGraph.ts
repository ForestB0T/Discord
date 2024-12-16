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

        const graph = await createPlaytimeGraph(graphData);

        await interaction.editReply({
            embeds: [
                {
                    title: "📊 Playtime Graph",
                    description: `**User:** ${user}\n**Duration:** ${duration.replace('_', ' ')}\n**Server:** ${thisGuild.mc_server}`,
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
