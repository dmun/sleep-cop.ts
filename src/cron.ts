import { Bedtime } from "./database";
import { client } from ".";
import cron, { type ScheduledTask } from "node-cron";
import { playSound } from "./audio-player";

export const runningJobs = new Map<string, ScheduledTask>();

export async function startJobs() {
	const bedtimes = await Bedtime.findAll();
	bedtimes.forEach(bedtime => {
		const memberId = bedtime.get("member_id") as string;
		const hour = bedtime.get("hour");
		const minute = bedtime.get("minute");
		const days = bedtime.get("days");

		console.log(`running task for ${memberId} scheduled for ${hour}:${minute}`);

		const cronExpr = `${minute} ${hour} * * ${days}`;
		runningJobs.set(
			memberId,
			cron.schedule(
				cronExpr,
				() => {
					disconnectMember(memberId);
				},
				{
					recoverMissedExecutions: false,
					timezone: "Europe/Amsterdam",
				},
			),
		);
	});
}

export async function refreshJob(memberId: string) {
	const bedtime = await Bedtime.findByPk(memberId);
	if (!bedtime) return;

	const hour = bedtime.get("hour");
	const minute = bedtime.get("minute");
	const days = bedtime.get("days");
	const cronExpr = `${minute} ${hour} * * ${days}`;

	console.log(
		`refreshing task for ${memberId} scheduled for ${hour}:${minute}`,
	);

	runningJobs.get(memberId)?.stop();
	runningJobs.set(
		memberId,
		cron.schedule(
			cronExpr,
			() => {
				disconnectMember(memberId);
			},
			{
				recoverMissedExecutions: false,
				timezone: "Europe/Amsterdam",
			},
		),
	);
}

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
