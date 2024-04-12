import type { ModalSubmitInteraction, CacheType } from "discord.js";
import type { InteractionHandler } from "../types";
import { Tags } from "../database";

export const timeSubmitHandler: InteractionHandler<ModalSubmitInteraction> = {
	customId: "timeSubmit",
	async execute(interaction: ModalSubmitInteraction<CacheType>) {
		const time = interaction.fields.getTextInputValue("input");
		console.log(interaction.customId);

		const tag = await Tags.findOne({
			where: { username: interaction.user.username },
		});

		if (tag) {
			tag.increment("usage_count");
			console.log("log", tag.get("usage_count"));
		}

		try {
			const tag = await Tags.create({
				username: interaction.user.username,
			});
		} catch (error: any) {
			if (error.name === "SequelizeUniqueConstraintError") {
				interaction.reply("That tag already exists.");
			}

			interaction.reply("Something went wrong with adding a tag.");
		}

		interaction.reply(`set to ${time}`);
	},
};
