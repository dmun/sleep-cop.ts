import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../deploy-commands";
import type { Command } from "./command";

export const RefreshCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("refreshcommands")
    .setDescription("Refreshes available slash commands"),

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId;

    if (guildId == null) {
      interaction.reply("No `guildId` found.");
      return;
    }

    await deployCommands({ guildId: guildId });
    interaction.reply("Commands refreshed!");
  },
};
