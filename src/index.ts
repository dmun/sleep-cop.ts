import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildCreate, async guild => {
  await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  commands
    .filter(command => command.data.name == commandName)[0]
    .execute(interaction);
});

client.login(config.SLEEP_COP_TOKEN);
