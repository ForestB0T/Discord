import { CommandInteraction } from "discord.js";

export default class ErrorHandler {

    public noBotPermission(interaction: CommandInteraction, perm: string): void {
        interaction.reply(`I don't have the permission to do that.`);
        interaction.reply(`I need the permission \`${perm}\` to do that.`);
    }

    public noUserPermission(interaction: CommandInteraction, perm: string): void {
        interaction.reply(`> You need the permission **\`${perm}\`** to do that.`);
    }

}