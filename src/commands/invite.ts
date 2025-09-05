import { CommandInteraction, MessageEmbed } from "discord.js";

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "invite",
        description: "Get an invite link for ForestBot",
        type: 1
    },
    run: async (interaction: CommandInteraction, client, thisGuild) => {   

        const embed = new MessageEmbed()
            .setColor("#00ffcc") // You can pick any color
            .setTitle("Invite ForestBot")
            .setDescription("Use the links below to invite the bot or join the support server!")
            .addFields(
                { name: "🤖 Bot Invite", value: "[Click Here](https://discord.com/oauth2/authorize?client_id=771280674602614825&scope=bot&permissions=8)" },
                { name: "💬 Support Server", value: "[Join Here](https://discord.com/invite/2P8enrdY6t)" }
            )
            .setFooter({ text: "Thank you for supporting ForestBot!" });

        await interaction.reply({ embeds: [embed], ephemeral: true }); // ephemeral makes it visible only to the user
    }
}
