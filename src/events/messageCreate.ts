import type { Message } from "discord.js"
import fetchData from "../fuctions/fetch.js";
import type ForestBot from "../structure/discord/Client"
import makeTablistEmbed from "../utils/embeds/make_tablist_embed.js";

const prefix = "!";


async function statusEmbedBuilder() {
    const data = await fetchData("https://api.forestbot.org/status") as any;
    const value = data.status.connectedServers.map(server => `- ${server}`).join('\n');
    const embed = {
        title: "API Status",
        fields: [
            { name: 'Connected Servers', value: value.length > 0 ? `\`\`\`\n${value}\n\`\`\`` : 'No servers connected' },
            { name: 'Database Connection', value: data.status.databaseIsConnected ? 'Connected' : 'Disconnected' },
            { name: 'Memory Usage', value: data.status.memory },
            { name: 'Messages Saved', value: (data.status.messages.toLocaleString()).toString() , inline: true },
            { name: 'Users Saved', value: (data.status.users.toLocaleString()).toString(), inline: true }
        ]
    };

   return embed;
}

export default {
    name: "messageCreate",
    once: false,
    execute: async (message: Message, client: ForestBot) => {

        const { content, author, channel } = message;
        const args = content.split(" ");
        args.shift();

        if (content.startsWith(prefix + "tab")) {
            if (!args[0]) return;
            const server = args[0];
            return channel.send(makeTablistEmbed(server, server+"_refresh"));
        }


        if (content.startsWith(prefix + "status")) {
            const msg = await channel.send({ embeds: [await statusEmbedBuilder()] });
            setInterval(async () => {
                await msg.edit({ embeds: [await statusEmbedBuilder()] });
            }, 200000);
        }
    

    }
}
