import { CommandInteraction, Message } from 'discord.js';
import type ForestBot                  from '../structure/discord/Client';
import { db }                          from "../index.js";
import { getNameFromDomain }           from '../utils/checkString';

export default {
    permissions: "MANAGE_SERVER",
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
                        description: "user you want to lookup",
                        type: 3,
                        required: true
                    },
                    {
                        name: "channel",
                        description: "channel you want to use me in, this is optional",
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
                        required: true
                    }
                ]
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {

        let mcserver   = interaction.options.getString("mcserver");
        const channel    = interaction.options.getChannel("channel");
        const user       = interaction.user.username;
        const guild_id   = interaction.guild.id;
        const guild_name = interaction.guild.name;
        const subCommand = interaction.options.getSubcommand();

        mcserver = getNameFromDomain(mcserver);

        const addLivechat = async () => {
            if (channel.type !== "GUILD_TEXT") {
                return interaction.reply({
                    content: "> The channel you specified is not a text channel.",
                    ephemeral: true
                })
            }

            try {

                const res = await db.pQuery(
                    "SELECT * FROM livechats WHERE guildID = ?",
                    [guild_id]
                );

                if (res["channelID"] === channel.id) { 
                    return interaction.reply({
                        content: "> The channel you specified is already a livechat channel.",
                        ephemeral: true
                    })
                }

                if (res["mc_server"] === mcserver) {
                    return interaction.reply({
                        content: "> A livechat is already setup for this minecraft server.",
                        ephemeral: true
                    })
                }

                await db.pQuery(
                    "INSERT INTO livechats (guildName,guildID,channelID,setupBy,date,mc_server) VALUES(?,?,?,?,?,?)",
                    [guild_name, guild_id, channel.id, user, new Date(), mcserver]
                );

                return interaction.reply({
                    content: "> Live chat initialized, allow up to 2 minutes for messages to appear.",
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
                const results = await db.pQuery(
                    "DELETE FROM livechats WHERE guildID = ? AND channelID = ?",
                    [guild_id, channel.id]
                )

                if (results["affectedRows"] === 0) {
                    return interaction.reply({
                        content: "> There is no live chat in this channel.",
                        ephemeral: true
                    })
                }

                return interaction.reply({
                    content: "> Live chat has been removed.",
                    ephemeral: true
                })
            }
            catch (err) {
                return interaction.reply({
                    content: "> Unexpected error while trying to remove the livechat, try again in a bit or contact support.",
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