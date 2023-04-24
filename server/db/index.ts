import k, { Knex } from "knex";
const { knex } = k;

const connectToDatabase = () => {
	let connection: Knex.Config;
	if (process.env.NODE_ENV === "prod") {
		const DB_URI = process.env.DB_URI!;
		connection = {
			client: "pg",
			connection: {
				connectString: DB_URI,
				ssl: true,
			},
		};
	} else {
		const DB_USER = process.env.DB_USER;
		const DB_PASSWORD = process.env.DB_PASSWORD;

		connection = {
			client: "pg",
			connection: {
				host: "localhost",
				port: 5432,
				user: DB_USER,
				password: DB_PASSWORD,
				database: "smart-brain",
			},
		};
	}

	const config: Knex.Config = connection;

	const db = knex(config);
	return db;
};

const db = connectToDatabase();

export default db;
