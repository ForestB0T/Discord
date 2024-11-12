import type { CommandInteraction, GuildMember, PermissionResolvable } from 'discord.js';
import type ForestBot  from '../structure/discord/Client';
import { cnf }         from '../structure/config.js';

/**
 * This function is ran everytime someone does a "/" slash command.
 * The slash command provides the interaction instance and we pass our client.
 * This function is called in the "interactionCreate" event located at
 * /src/events/interactionCreate.ts
 * @param interaction 
 * @param client 
 * @returns 
 */
export default async function commandHandler(interaction: CommandInteraction, client: ForestBot) {

    /**
     * Fetching the members information who ran the command.
     */
    const member:GuildMember = await interaction.guild.members.fetch(interaction.user.id);

    /**
     * Destructuring our command object.
     * this has the specific commands config options.
     */
    let { permissions, run, channel_strict, requires_setup, Iswhitelisted } = client.commandCollection.get(interaction.commandName).default;

    /**
     * Getting the guild info the command was ran in.
     */
    const thisGuild = client.cachedGuilds.get(interaction.guild.id);

    /**
     * Checking if the command is whitelisted.
     */
    if (Iswhitelisted && !cnf.whitelistedids.includes(member.user.id)) {
        return interaction.reply({
            content: "This command is whitelisted.",
            ephemeral: true
        });
    } 

    /**
     * Checking if the command requires setup and if 
     * it is setup or not.
     */
    if (requires_setup && !thisGuild) { 
        return interaction.reply({
            content: `> I have not been setup yet.`,
            ephemeral: true
        });
    }

    /**
     * Checking if the command was ran in the right channel
     * if the owner of the server set the bot to channel specific.
     */
    if (thisGuild && (channel_strict && (/^\d+$/.test(thisGuild.channel_id)))) { 
        if (thisGuild.channel_id !== interaction.channel.id) {
            interaction.reply({
                content: `> Please use commands in <#${thisGuild.channel_id}>.`,
                ephemeral: true
            });
            return;
        }
    }

    /**
     * Checking that the user has the correct
     * permissions to be running the command.
     */
    if (permissions) {
        if (typeof permissions === "string") permissions = [permissions];
        for (const perm of permissions) {

            if (member.roles.cache.some(role => role.permissions.has(perm as PermissionResolvable))) return run(interaction, client, thisGuild);

            if (!member.permissions.has(perm as PermissionResolvable)) {
                client.ErrorHandler.noUserPermission(interaction, perm);
                return
            }
        }
    }


    /**
     * Everything checked out okay.
     * Running the command.
     */
    return run(interaction, client, thisGuild, client.API);

}