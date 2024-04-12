import {
	Client,
	Colors,
	Events,
	GatewayIntentBits,
	InteractionType,
	PermissionFlagsBits,
} from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import commands from "./commands";
import { Tags } from "./database";
import { timeSubmitHandler } from "./handlers/time-submit";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, readyClient => {
	Tags.sync();
	const permissions = 39584887996432;
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	console.log(
		`\nInvite link: https://discord.com/api/oauth2/authorize?client_id=${config.SLEEP_COP_CLIENT_ID}&permissions=${permissions}&scope=bot%20applications.commands`,
	);
});

client.on(Events.GuildCreate, async guild => {
	await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async interaction => {
	console.log(interaction.guildId);

	const guild = client.guilds.cache.get("511184618976837672");

	if (guild) {
		console.log("actual", guild.id);
		const bruh = guild.channels.cache
			.filter(channel => channel.isVoiceBased())
			.find(channel => {
				if (channel.isVoiceBased()) {
					channel.members.forEach(x => console.log(x.id));
					const member = channel.members.find(
						x => x.id === "157063395969990656",
					);
					member?.voice.disconnect();
					console.log(member?.manageable);
				}
			});
		console.log(bruh);

		// guild.channels.cache.filter(guild => guild.members);
		// client.guilds.cache.filter(guild =>
		//   guild.members.cache.has(interaction.member!!.user.id),
		// );
	}

	switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			const { commandName } = interaction;

			commands
				.filter(command => command.data.name == commandName)[0]
				.execute(interaction);
			break;
		case InteractionType.MessageComponent:
			if (interaction.isButton()) {
				interaction.update("bruh");
			}
			break;
		case InteractionType.ModalSubmit:
			if (interaction.isModalSubmit()) {
				timeSubmitHandler.execute(interaction);
			}
			break;
	}
});

client.on(Events.ChannelUpdate, interaction => {
	console.log("feopwapfeafo", interaction);
});

client.on(Events.VoiceStateUpdate, interaction => {
	console.log("gjopeapfjeaf", interaction);
});

function checktime() {
	const now = new Date();
	const hour = now.getHours();
	const minute = now.getMinutes();

	console.log(`${hour}:${minute}`);

	if (hour === 21 && minute === 0) {
		console.log("bruh");
	}
}

setInterval(checktime, 5000);

client.login(config.SLEEP_COP_TOKEN);
