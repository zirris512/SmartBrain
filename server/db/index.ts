import k, { Knex } from "knex";
const { knex } = k;

const connectToDatabase = () => {
	const DB_USER = process.env.DB_USER;
	const DB_PASSWORD = process.env.DB_PASSWORD;

	const config: Knex.Config = {
		client: "pg",
		connection: {
			host: "localhost",
			port: 5432,
			user: DB_USER,
			password: DB_PASSWORD,
			database: "smart-brain",
		},
	};

	const db = knex(config);
	return db;
};

const db = connectToDatabase();

export default db;
