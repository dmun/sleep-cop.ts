import {
  type CommandInteraction,
  type CacheType,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import type { Command } from "./command";

export const buttonCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("fiopaepjiofewapjiofehuhuh"),

  async execute(interaction: CommandInteraction<CacheType>) {
    const confirm = new ButtonBuilder()
      .setCustomId("confrim")
      .setLabel("Confirm dawg")
      .setStyle(ButtonStyle.Primary);

    const modal = new ModalBuilder()
      .setCustomId("myMoedal")
      .setTitle("my moydl!");

    const input = new TextInputBuilder()
      .setCustomId("input")
      .setLabel("tijd  ?")
      .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);
    const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

    modal.addComponents(row2);

    await interaction.showModal(modal);

    // interaction.reply({ content: "jemoeder", components: [row] });
  },
};
