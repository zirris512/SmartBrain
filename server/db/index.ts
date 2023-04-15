export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	entries: number;
	joined: Date;
}

const db: { users: User[] } = {
	users: [
		{
			id: 0,
			name: "John",
			email: "john@example.com",
			password: "$2a$10$T/mX9gYbGeQcYJbqo8J.DuVUcEwv2LvKNQgJFFN4.cUEKobImF6oy",
			entries: 0,
			joined: new Date(),
		},
		{
			id: 1,
			name: "Sally",
			email: "sally@example.com",
			password: "$2a$10$ha9CFB6I3Cgm9Ac8QTpAT.oZIfh3WxmS5nl/iXo/HTWc2saBx.KfC",
			entries: 0,
			joined: new Date(),
		},
	],
};

export default db;
