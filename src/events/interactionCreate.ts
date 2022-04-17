import { Interaction } from 'discord.js';
import buttonHandler from '../handlers/interaction_button_handler.js';
import commandHandler  from '../handlers/interaction_command_handler.js'
import type ForestBot  from '../structure/discord/Client.js';

export default {
    name: "interactionCreate",
    once: false,
    execute: async (interaction: Interaction, client: ForestBot) => {
        if (interaction.isButton())  return buttonHandler(interaction, client);
        if (interaction.isCommand()) return commandHandler(interaction, client);
    }
}