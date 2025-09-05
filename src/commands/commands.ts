import {
    CommandInteraction,
    MessageActionRow,
    MessageButton
} from "discord.js";
import type ForestBot from "../structure/discord/Client";
import type { Guild } from "discord.js";

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: false,
    requires_setup: false,
    data: {
        name: "commands",
        description: "In game commands",
        type: 1
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {
        const commandsText = `
## 📜 ForestBot In-Game Commands

### ⚡ General
\`!addfaq <text>\` — Add a new FAQ  
\`!coords\` — Get the bot’s coordinates  
\`!discord\` — Show the Discord invite  
\`!faq <id>\` — Retrieve a FAQ entry  
\`!help\` — Show help  
\`!iam <text>\` — Set your whois description  

### 📊 Player Stats
\`!joindate <user>\` — Get join date  
\`!joins <user>\` — Number of joins  
\`!kd <user>\` — Kill/Death ratio  
\`!playtime <user>\` — Total playtime  
\`!lastkill <user>\` — Last kill  
\`!lastdeath <user>\` — Last death  

### 💬 Chat & Messaging
\`!firstmessage <user>\` — First message  
\`!offlinemsg <user> <text>\` — Send offline message  
\`!lastmessage <user>\` — Last message  
\`!msgcount <user>\` — Message count  
\`!wordcount <user> <word>\` — Word usage count  

### 🛠 Utility
\`!advancements <user>\` — Advancement count  
\`!lastadvancement <user>\` — Latest advancement  
\`!lastseen <user>\` — Last seen time  
\`!sleep\` — Put the bot to sleep  
\`!top <stat>\` — Leaderboard (kills, deaths, joins, playtime)  
\`!oldnames <user>\` — Previous usernames  
\`!realname <user>\` — Real username  

### 🎉 Fun
\`!quote <user>\` — Random quote  
\`!mount\` — Mount nearest boat  
\`!whois <user>\` — Show user description
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
            content: commandsText,
            components: [row],
            ephemeral: true
        });
    }
};
