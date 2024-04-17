import {
	type CommandInteraction,
	type CacheType,
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";
import type { Command } from "../types";
import { Bedtime } from "../database";
import { refreshJob } from "../cron";

export const setBedtimeCommand: Command = {
	data: new SlashCommandBuilder()
		.setName("setbedtime")
		.setDescription("Set your bed time.")
		.addIntegerOption(option =>
			option
				.setName("hour")
				.setDescription("Bedtime hour (0-23)")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(23),
		)
		.addIntegerOption(option =>
			option
				.setName("minute")
				.setDescription("Bedtime minute (0-59)")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(59),
		),

	async execute(interaction: CommandInteraction<CacheType>) {
		const days = {
			1: "Monday",
			2: "Tuesday",
			3: "Wednesday",
			4: "Thursday",
			5: "Friday",
			6: "Saturday",
			7: "Sunday",
		};

		const daysOptions = Object.entries(days).map(([key, value]) => {
			return new StringSelectMenuOptionBuilder().setLabel(value).setValue(key);
		});

		const daySelect = new StringSelectMenuBuilder()
			.setCustomId("day")
			.setPlaceholder("Select atleast one day")
			.setMinValues(1)
			.setMaxValues(7)
			.addOptions(...daysOptions);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			daySelect,
		);

		const hour = interaction.options.data.find(x => x.name === "hour")!!.value;
		const minute = interaction.options.data.find(x => x.name === "minute")!!
			.value;

		await Bedtime.upsert({
			member_id: interaction.user.id,
			hour: hour,
			minute: minute,
		});

		const response = await interaction.reply({
			content: `You selected a bed time of **${hour}:${minute}**!\n\nOn which days would you like to enforce it?`,
			components: [row],
		});

		const collectorFilter = (i: any) => i.user.id === interaction.user.id;

		try {
			const selectInteraction = await response.awaitMessageComponent({
				filter: collectorFilter,
				time: 60_000,
			});

			if (!selectInteraction.isStringSelectMenu()) return;

			const days = selectInteraction.values.join(",");
			await Bedtime.update(
				{ days: days },
				{ where: { member_id: selectInteraction.user.id } },
			);

			refreshJob(selectInteraction.user.id);

			await selectInteraction.update({
				content: "ok broer 👍👍👍",
				components: [],
			});
		} catch (e) {
			await interaction.editReply({
				content:
					"bedtijd kiezen gefaald! je hebt een minuut niks gedaan nu mag het niet meer!",
				components: [],
			});
		}
	},
};
