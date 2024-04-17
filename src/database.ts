import { INTEGER, STRING, Sequelize } from "sequelize";

export const sequelize = new Sequelize("database", "user", "passwsord", {
	host: "localhost",
	dialect: "sqlite",
	logging: true,
	storage: "database.sqlite",
});

export const Bedtime = sequelize.define("bedtime", {
	member_id: {
		type: STRING,
		primaryKey: true,
	},
	hour: {
		type: INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 23,
		},
	},
	minute: {
		type: INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 59,
		},
	},
	days: {
		type: STRING,
		defaultValue: "",
	},
});
