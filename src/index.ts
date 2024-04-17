import {
	Client,
	Events,
	GatewayIntentBits,
	Guild,
	GuildMember,
	InteractionType,
} from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import commands from "./commands";
import { Bedtime } from "./database";
import {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from "@discordjs/voice";
import { join } from "node:path";
import cron from "node-cron";

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
	Bedtime.sync();
	const permissions = 39584887996432;
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	console.log(
		`\nInvite link: https://discord.com/api/oauth2/authorize?client_id=${config.SLEEP_COP_CLIENT_ID}&permissions=${permissions}&scope=bot%20applications.commands`,
	);
});

client.on(Events.GuildCreate, async guild => {
	await deployCommands({ guildId: guild.id });
});

function disconnectMember(memberId: string) {
	console.log(`disconnectMember: disconnecting member ${memberId}`);

	client.guilds.cache.find(guild => {
		guild.members.cache.forEach(member => {
			if (member.id === memberId) {
				playSound(member, guild, "sounds/reverb_fart.ogg");
			}
		});
	});
}

function playSound(member: GuildMember, guild: Guild, path: string) {
	if (!member.voice.channelId) {
		console.log(`disconnectMember: ${member.nickname} voice channel not found`);
		return;
	}

	const connection = joinVoiceChannel({
		channelId: member.voice.channelId,
		guildId: guild.id,
		adapterCreator: guild.voiceAdapterCreator,
		selfDeaf: false,
	});
	const player = createAudioPlayer();
	const resource = createAudioResource(join(__dirname, path));

	player.on("stateChange", interaction => {
		console.log(`playSound: ${interaction.status}`);
	});

	const subscription = connection.subscribe(player);
	player.play(resource);

	if (subscription) {
		setTimeout(async () => {
			await member.voice.disconnect();
			console.log(`disconnectMember: succeeded`);
		}, 3300);

		setTimeout(() => {
			subscription.unsubscribe();
			connection.destroy();
		}, 5000);
	}
}

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

async function startJobs() {
	const bedtimes = await Bedtime.findAll();
	bedtimes.forEach(bedtime => {
		const memberId = bedtime.get("member_id");
		const hour = bedtime.get("hour");
		const minute = bedtime.get("minute");
		const days = bedtime.get("days");

		console.log(`running task for ${memberId} scheduled for ${hour}:${minute}`);

		const cronExpr = `${minute} ${hour} * * ${days}`;
		cron.schedule(
			cronExpr,
			() => {
				disconnectMember(memberId as string);
			},
			{
				recoverMissedExecutions: false,
				timezone: "Europe/Amsterdam",
			},
		);
	});
}

startJobs();

client.login(config.SLEEP_COP_TOKEN);
