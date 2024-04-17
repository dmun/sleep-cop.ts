import { Client, Events, GatewayIntentBits, InteractionType } from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import commands from "./commands";
import { Bedtime } from "./database";
import { startJobs } from "./cron";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

client.once(Events.ClientReady, readyClient => {
	Bedtime.sync();
	startJobs();

	const permissions = 39584887996432;
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	console.log(
		`\nInvite link:\nhttps://discord.com/api/oauth2/authorize?client_id=${config.SLEEP_COP_CLIENT_ID}&permissions=${permissions}&scope=bot%20applications.commands\n`,
	);
});

client.on(Events.GuildCreate, async guild => {
	await deployCommands({ guildId: guild.id });
});

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
	console.log(newState.channelId);
});

client.on(Events.InteractionCreate, async interaction => {
	console.log(`client.on: interaction ${interaction.type}`);

	switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			commands
				.filter(command => command.data.name == interaction.commandName)[0]
				.execute(interaction);
			break;
	}
});

client.login(config.SLEEP_COP_TOKEN);
