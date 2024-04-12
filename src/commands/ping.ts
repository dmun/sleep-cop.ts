import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),

	async execute(interaction: CommandInteraction) {
		await interaction.reply("Pong!");
	},
};
