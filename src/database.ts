import { ARRAY, INTEGER, STRING, Sequelize } from "sequelize";

export const sequelize = new Sequelize("database", "user", "passwsord", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

export const Bedtimes = sequelize.define("bedtimes", {
	member_id: {
		type: INTEGER,
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

export const Tags = sequelize.define("tags", {
	username: STRING,
	usage_count: {
		type: INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});
