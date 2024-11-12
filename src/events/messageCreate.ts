import type { Message } from "discord.js"
import type ForestBot from "../structure/discord/Client"
import makeTablistEmbed from "../utils/embeds/make_tablist_embed.js";

const prefix = "!";
const userCooldowns = new Map();

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

            client.API.websocket.sendDiscordChatMessage({
                message: content,
                username: username,
                mc_server: channelArgs.mc_server,
                timestamp: currentTime.toString(),
                channel_id: channel.id,
                guild_id: chan.guild.id,
                guild_name: chan.guild.name
            })
        }

    }
}
