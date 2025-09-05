import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getNameFromDomain } from '../utils/checkString.js';
import type ForestBot from '../structure/discord/Client';

export default {
    permissions: "MANAGE_GUILD",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "setup",
        description: "Set me up for the server you use me for.",
        type: 1,
        options: [
            {
                name: "mcserver",
                description: "The Minecraft server you use me for",
                type: 3,
                required: true
            },
            {
                name: "channel",
                description: "Channel you want to use me in (optional)",
                type: 7,
                required: false
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {

        let mcserver = interaction.options.getString("mcserver");
        const channel = interaction.options.getChannel("channel");
        const userTag = `${interaction.user.username}#${interaction.user.discriminator}`;
        const guildId = interaction.guild.id;
        const guildName = interaction.guild.name;

        mcserver = getNameFromDomain(mcserver);

        if (channel && channel.type !== "GUILD_TEXT") {
            return interaction.reply({
                content: "> The channel you specified is not a text channel.",
                ephemeral: true
            });
        }

        try {
            const success = await client.API.addGuild({
                guild_id: guildId,
                channel_id: channel ? channel.id : null,
                mc_server: mcserver,
                setup_by: userTag,
                created_at: Date.now(),
                guild_name: guildName
            });

            await client.syncGuildCache();

            if (!success || !success.success) {
                throw new Error("Failed to post addGuild");
            }

            const embed = new MessageEmbed()
                .setColor("#57F287") // dark green
                .setTitle("ForestBot Setup Complete ✅")
                .setDescription(`I am now set up for the Minecraft server **${mcserver}**.`)
                .addFields(
                    channel ? { name: "Commands Channel", value: `<#${channel.id}>` } : { name: "Commands Channel", value: "No channel specified, commands will work everywhere." }
                )
                .setFooter({ text: "Need help or support? Join our support server: https://discord.com/invite/2P8enrdY6t" });

            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: "> An error occurred while setting up the server. Please try again or contact support.",
                ephemeral: true
            });
        }
    }
};
