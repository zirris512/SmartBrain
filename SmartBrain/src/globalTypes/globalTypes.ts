export interface ImageBoxType {
	leftCol: number;
	topRow: number;
	rightCol: number;
	bottomRow: number;
}

export interface RouteChange {
	onRouteChange(route: string): void;
	loadUser(user: User): void;
}

export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	entries: number;
	joined: Date;
}

export interface Database {
	users: User[];
}
