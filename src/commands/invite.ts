import { CommandInteraction } from "discord.js";

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "invite",
        description: "Get a an invite link for ForestBot",
        type: 1
    },
    run: async (interaction: CommandInteraction, client, thisGuild: Guild) => {   
    
        await interaction.reply({
            content: `> [ Invite Link ](https://discord.com/oauth2/authorize?client_id=771280674602614825 )`,
        })
        return;

    }
}