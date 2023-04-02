import { CommandInteraction, Message } from 'discord.js';
import type ForestBot from '../structure/discord/Client';
import { api } from "../index.js";
import { getNameFromDomain } from '../utils/checkString.js';

export default {
    permissions: "MANAGE_GUILD",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "livechat",
        description: "initialize a livechat for the server you use me for.",
        type: 1,
        options: [
            {
                name: "add",
                description: "add livechat",
                type: 1,
                options: [
                    {
                        name: "mcserver",
                        description: "the minecraft server you want to add a livechat for",
                        type: 3,
                        required: true
                    },
                    {
                        name: "channel",
                        description: "channel for the livechat",
                        type: 7,
                        required: true
                    }
                ]
            },
            {
                name: "remove",
                description: "remove livechat",
                type: 1,
                options: [
                    {
                        name: "channel",
                        description: "the channel you want to remove the livechat in",
                        type: 7,
                        required: false
                    }
                ]
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {

        let mcserver     = interaction.options.getString("mcserver");
        const channel    = interaction.options.getChannel("channel");
        const user       = `${interaction.user.username}#${interaction.user.discriminator}`;
        const guild_id   = interaction.guild.id;
        const guild_name = interaction.guild.name;
        const subCommand = interaction.options.getSubcommand();

        if (mcserver) mcserver = getNameFromDomain(mcserver);

        const addLivechat = async () => {

            if (channel.type !== "GUILD_TEXT")
                return interaction.reply({
                    content: "> The channel you specified is not a text channel.",
                    ephemeral: true
                })

            try {
                const success = await api.addLiveChat({
                    guildName: guild_name,
                    guildID: guild_id,
                    channelID: channel.id,
                    mc_server: mcserver,
                    setupBy: user,
                    date: `${Date.now()}`
                })

                await client.syncLiveChatChannelsCache();

                if (!success || !success.success) {
                    throw new Error("Failed to fetch add livechat guild.")
                }

                return interaction.reply({
                    content: `> Live chat initialized for ${mcserver}, allow up to 2 minutes for messages to appear.`,
                    ephemeral: false
                })

            } catch (err) {
                return interaction.reply({
                    content: "> either an error occured or the channel is already occupied with a livechat",
                    ephemeral: true
                })
            }

        }

        const removeLivechat = async () => {

            try {
                await api.removeLiveChat({guild_id, channel_id: channel ? channel.id : null});
               
                await client.syncLiveChatChannelsCache();

                let removedStr = !channel
                    ? "> Livechat removed from all channels, allow up to 2 minutes for messages to stop."
                    : "> Live chat has been removed, allow up to 2 minutes for messages to stop."

                return interaction.reply({
                    content: removedStr,
                    ephemeral: true
                })

            } catch (err) {
                return interaction.reply({
                    content: "> An error occured while removing the livechat.",
                    ephemeral: true
                })
            }

        }


        switch (subCommand) {
            case "add":
                return addLivechat();
            case "remove":
                return removeLivechat();
        }
    }
}