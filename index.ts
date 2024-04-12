import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  InteractionType,
} from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import commands from "./commands";
import { Tags } from "./database";
import handlers from "./handlers";
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
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildCreate, async guild => {
  await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async interaction => {
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

client.login(config.SLEEP_COP_TOKEN);
