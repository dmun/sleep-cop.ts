import {
	Client,
	Events,
	GatewayIntentBits,
	InteractionType,
	time,
} from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import commands from "./commands";
import { Bedtimes, Tags } from "./database";
import { timeSubmitHandler } from "./handlers/time-submit";
import {
	AudioPlayer,
	AudioPlayerError,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	generateDependencyReport,
	joinVoiceChannel,
} from "@discordjs/voice";
import { join } from "node:path";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

client.once(Events.ClientReady, readyClient => {
	Tags.sync();
	Bedtimes.sync();
	const permissions = 39584887996432;
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	console.log(
		`\nInvite link: https://discord.com/api/oauth2/authorize?client_id=${config.SLEEP_COP_CLIENT_ID}&permissions=${permissions}&scope=bot%20applications.commands`,
	);
});

client.on(Events.GuildCreate, async guild => {
	await deployCommands({ guildId: guild.id });
});

const memberId = "157063395969990656";

function disconnectMember(memberId: string) {
	client.guilds.cache.find(guild => {
		guild.members.cache.forEach(member => {
			if (member.id === memberId) {
				const player = createAudioPlayer();
				const connection = joinVoiceChannel({
					channelId: member.voice.channelId!!,
					guildId: guild.id,
					adapterCreator: guild.voiceAdapterCreator,
					selfDeaf: false,
				});
				const resource = createAudioResource(
					join(__dirname, "sounds/reverb_fart.ogg"),
				);

				const subscription = connection.subscribe(player);
				player.play(resource);

				if (subscription) {
					setTimeout(() => {
						subscription.unsubscribe();
					}, resource.playbackDuration - 300);
				}

				connection.destroy();
			}
		});
	});
}

client.on(Events.InteractionCreate, async interaction => {
	console.log(interaction.type);

	disconnectMember(memberId);

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

			if (interaction.isStringSelectMenu()) {
				timeSubmitHandler.execute(interaction);
			}

			break;
		case InteractionType.ModalSubmit:
			if (interaction.isModalSubmit()) {
			}
			break;
	}
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

// setInterval(checktime, 5000);

client.login(config.SLEEP_COP_TOKEN);
