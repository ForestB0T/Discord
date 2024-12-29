import makeTablistEmbed from "../utils/embeds/make_tablist_embed.js";
import type { Interaction } from "discord.js";
import type ForestBot from "../structure/discord/Client";

export default async function buttonHandler(interaction: Interaction, client: ForestBot) {
    if (!interaction.isButton()) return;
    const thisGuild = client.cachedGuilds.get(interaction.guild.id);

    if (!thisGuild) {
        await interaction.deferReply({ ephemeral: true });
        return interaction.followUp({
            content: "> I am not setup yet.",
            ephemeral: true
        });
    }

    if (interaction["customId"] === "refresh" || interaction["customId"] === thisGuild.mc_server) {
        await interaction.deferUpdate();
        return await interaction.editReply(await makeTablistEmbed(thisGuild.mc_server.toLowerCase(), "refresh"));
    }
};