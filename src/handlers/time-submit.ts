import type { StringSelectMenuInteraction } from "discord.js";
import type { InteractionHandler } from "../types";
import { Bedtime } from "../database";

export const timeSubmitHandler: InteractionHandler<StringSelectMenuInteraction> =
	{
		customId: "timeSubmit",
		async execute(interaction: StringSelectMenuInteraction) {
			const userId = interaction.member?.user.id;

			if (!userId) return;

			const days = interaction.values.join(",");
			await Bedtime.update({ days: days }, { where: { member_id: userId } });
		},
	};
