import {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from "@discordjs/voice";
import type { Guild, GuildMember } from "discord.js";
import { join } from "path";

export function playSound(member: GuildMember, guild: Guild, path: string) {
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
