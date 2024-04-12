import { INTEGER, STRING, Sequelize } from "sequelize";

export const sequelize = new Sequelize("database", "user", "passwsord", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

export const Tags = sequelize.define("tags", {
  username: STRING,
  usage_count: {
    type: INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
