import { Client, Events, GatewayIntentBits, InteractionType } from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { INTEGER, STRING, Sequelize } from "sequelize";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const sequelize = new Sequelize("database", "user", "passwsord", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Tags = sequelize.define("tags", {
  username: STRING,
  usage_count: {
    type: INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
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
        const time = interaction.fields.getTextInputValue("input");

        const tag = await Tags.findOne({
          where: { username: interaction.user.username },
        });

        if (tag) {
          tag.increment("usage_count");
          console.log("log", tag.get("usage_count"));
        }

        try {
          const tag = await Tags.create({
            username: interaction.user.username,
          });
        } catch (error: any) {
          if (error.name === "SequelizeUniqueConstraintError") {
            interaction.reply("That tag already exists.");
          }

          interaction.reply("Something went wrong with adding a tag.");
        }

        interaction.reply(`set to ${time}`);
      }
      break;
  }
});

client.login(config.SLEEP_COP_TOKEN);
