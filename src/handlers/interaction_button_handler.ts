import makeTablistEmbed from "../utils/embeds/make_tablist_embed.js";
import type { Interaction } from "discord.js";
import type ForestBot from "../structure/discord/Client";

export default async function buttonHandler(interaction: Interaction, client: ForestBot) {
    if (!interaction.isButton()) return;
    const thisGuild = client.cachedGuilds.get(interaction.guild.id);

    if (!thisGuild) {
        return interaction.reply({
            content: "> I am not setup yet.",
            ephemeral: true
        })
    }

    if (interaction["customId"] === "refresh") {
        return await interaction.update(makeTablistEmbed(thisGuild.mc_server, "refresh"));
    } else if (interaction["customId"]) {
        let title = interaction["customId"];
        if (title.endsWith("_refresh")) {
            title = title.slice(0, -8);
        }
    
        return await interaction.update(makeTablistEmbed(title, interaction["customId"]));
    }

};