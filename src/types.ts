import type {
	CommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
} from "discord.js";

export type Command = {
	data:
		| SlashCommandBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute(interaction: CommandInteraction): void;
};

export type InteractionHandler<T> = {
	customId: string;
	execute(interaction: T): void;
};

export type ModalSubmitHandler = {
	execute(interaction: ModalSubmitInteraction): void;
};
