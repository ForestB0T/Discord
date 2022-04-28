import type { CommandInteraction, GuildMember } from 'discord.js';
import type ForestBot                           from '../structure/discord/Client';

export default async function commandHandler(interaction: CommandInteraction, client: ForestBot) {

    const member:GuildMember = await interaction.guild.members.fetch(interaction.user.id);

    let { permissions, run, channel_strict, requires_setup } = client.commandCollection.get(interaction.commandName).default;

    const thisGuild = client.cachedGuilds.get(interaction.guild.id);

    if (requires_setup && !thisGuild) { 
        return interaction.reply({
            content: `> I have not been setup yet.`,
            ephemeral: true
        });
    }

    if (thisGuild && (channel_strict && (/^\d+$/.test(thisGuild.channel_id)))) { 
        if (thisGuild.channel_id !== interaction.channel.id) {
            interaction.reply({
                content: `> Please use commands in <#${thisGuild.channel_id}>.`,
                ephemeral: true
            });
            return
        }
    }

    if (permissions) {
        if (typeof permissions === "string") permissions = [permissions];
        for (const perm of permissions) {
            if (!member.permissions.has(perm)) {
                client.ErrorHandler.noUserPermission(interaction, perm);
                return
            }
        }
    }



    return run(interaction, client, thisGuild);

}