import { CommandInteraction } from 'discord.js';
import { color } from '../index.js';
import { dhms } from '../utils/time/dhms.js';
import { timeAgoStr } from '../utils/time/convert.js';
import { convertUnixTimestamp } from '../utils/time/convert.js';
import type ForestBot from '../structure/discord/Client';
import { addWatcher, checkWatcherListByDiscordUser, deleteWatcher, watcherAlertEmbed } from '../utils/watcher/userLoginWatcher.js';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "watcher",
        description: "Get notified when a user joins the server",
        type: 1,
        options: [
            {
                name: "action",
                description: "whether to add or remove a user from the watcher list",
                type: 3, // STRING type
                required: true,
                choices: [
                    { name: "add", value: "add" },
                    { name: "remove", value: "remove" },
                ]
            },
            {
                name: "user",
                description: "user you want to be notified about",
                type: 3,
                required: true
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {

        await interaction.deferReply({ ephemeral: true });

        const userToAdd = interaction.options.getString("user");
        const choice = interaction.options.getString("action");

        const uuid = await client.API.convertUsernameToUuid(userToAdd);
        if (!uuid) {
            interaction.editReply({
                content: `> Could not find user: **${userToAdd}**`,
            });
            return
        }

        switch (choice) {
            case "add":
                const ret = await addWatcher({
                    username: userToAdd,
                    mc_server: thisGuild.mc_server,
                    uuid: uuid,
                    time: Date.now(),
                    discordUserToNotify: interaction.user.id
                });

                if (ret === "exists") {
                    interaction.editReply({
                        content: `> **${userToAdd}** is already being watched.`,
                    });
                    return;
                }
                interaction.editReply({
                    content: `> Added **${userToAdd}** to the watcher list.`
                });

                watcherAlertEmbed(interaction.user, userToAdd, "added to your watcher list", thisGuild.mc_server, "yellow");
                break;

            case "remove":

                const list = checkWatcherListByDiscordUser(interaction.user.id);
                if (!list) {
                    interaction.editReply({
                        content: `> You are not watching anyone.`
                    });
                    return;
                }

                const watcher = list.find((w) => w.username === userToAdd);
                if (!watcher) {
                    interaction.editReply({
                        content: `> You are not watching **${userToAdd}**.`
                    });
                    return;
                }

                await deleteWatcher(interaction.user.id, thisGuild.mc_server, userToAdd);
                interaction.editReply({
                    content: `> Removed **${userToAdd}** from your watcher list.`
                });
                break;

            default:
                break;
        }



    }
}