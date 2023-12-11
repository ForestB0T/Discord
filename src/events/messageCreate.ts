import type { Message } from "discord.js"
import fetchData from "../fuctions/fetch.js";
import type ForestBot from "../structure/discord/Client"
import makeTablistEmbed from "../utils/embeds/make_tablist_embed.js";
import { websocket } from "../index.js";

const prefix = "!";
const userCooldowns = new Map();

async function statusEmbedBuilder() {
    const data = await fetchData("https://api.forestbot.org/status") as any;
    const value = data.status.connectedServers.map(server => `- ${server}`).join('\n');
    const embed = {
        title: "API Status",
        fields: [
            { name: 'Connected Servers', value: value.length > 0 ? `\`\`\`\n${value}\n\`\`\`` : 'No servers connected' },
            { name: 'Database Connection', value: data.status.databaseIsConnected ? 'Connected' : 'Disconnected' },
            { name: 'Memory Usage', value: data.status.memory },
            { name: 'Messages Saved', value: (data.status.messages.toLocaleString()).toString(), inline: true },
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
        if (author.id === client.user.id || !content) return;
        const args = content.split(" ");
        args.shift();

        if (content.startsWith(prefix + "tab")) {
            if (!args[0]) return;
            const server = args[0];
            return channel.send(await makeTablistEmbed(server, server + "_refresh"));
        }

        if (content.startsWith(prefix + "status")) {
            const msg = await channel.send({ embeds: [await statusEmbedBuilder()] });
            setInterval(async () => {
                await msg.edit({ embeds: [await statusEmbedBuilder()] });
            }, 200000);
        }


        if (client.liveChatChannelCache.has(channel.id) && content && content.length < 250) {
            const username = `${author.username}#${author.discriminator}`;
            const { channel: chan, channelArgs } = client.liveChatChannelCache.get(channel.id);

            // Check user cooldown for this channel
            const userLastMessageTime = userCooldowns.get(username)?.get(channelArgs.mc_server) || 0;
            const currentTime = Date.now();
            if (currentTime - userLastMessageTime < 10000) {
                return;
            }

            // Update user cooldown for this channel
            if (!userCooldowns.has(username)) {
                userCooldowns.set(username, new Map());
            }
            userCooldowns.get(username)?.set(channelArgs.mc_server, currentTime);

            // Send message to Minecraft server
            websocket.send({
                action: "chat",
                data: {
                    username,
                    message: content,
                    time: currentTime,
                    mc_server: channelArgs.mc_server
                },
                mcServer: channelArgs.mc_server,
                type: "discord"
            });
        }

    }
}
