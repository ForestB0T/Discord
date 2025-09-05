import {
    CommandInteraction,
    MessageActionRow,
    MessageButton
} from "discord.js";

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "help",
        description: "Get help on how to set me up",
        type: 1
    },
    run: async (interaction: CommandInteraction) => {
        const helpText = `
## 📜 ForestBot Help
Here are the commands you can use:

🔍 **/search [user]** – Query statistics about a specific user  
📨 **/messages [user]** – Retrieve all messages from a specific user  
⚙️ **/setup [mc_server] (channel)** – Configure the bot for your server  
📋 **/tablist** – Get the live tablist of the Minecraft server  
💬 **/livechat [mc_server] (channel)** – Stream server chat into a channel  
📋 **/invite** – Invite ForestBot to another server  
👀 **/watcher add|remove <user>** – Get notified when a user joins  
📊 **/playtimegraph [user]** – Generate a playtime graph
        `;

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("🌐 Website")
                .setStyle("LINK")
                .setURL("https://forestbot.org"),
            new MessageButton()
                .setLabel("➕ Invite")
                .setStyle("LINK")
                .setURL("https://discord.com/oauth2/authorize?client_id=771280674602614825&scope=bot%20applications.commands&permissions=0")
        );

        return interaction.reply({
            content: helpText,
            components: [row],
            ephemeral: true // only visible to the user
        });
    }
};
