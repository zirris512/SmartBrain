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
// const db: { users: User[] } = {
// 	users: [
// 		{
// 			id: 0,
// 			name: "John",
// 			email: "john@example.com",
// 			password: "$2a$10$T/mX9gYbGeQcYJbqo8J.DuVUcEwv2LvKNQgJFFN4.cUEKobImF6oy",
// 			entries: 0,
// 			joined: new Date(),
// 		},
// 		{
// 			id: 1,
// 			name: "Sally",
// 			email: "sally@example.com",
// 			password: "$2a$10$ha9CFB6I3Cgm9Ac8QTpAT.oZIfh3WxmS5nl/iXo/HTWc2saBx.KfC",
// 			entries: 0,
// 			joined: new Date(),
// 		},
// 	],
// };

export default connectToDatabase;
