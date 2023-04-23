import { Request } from "express";

interface BoxType {
	bounding_box: {
		bottom_row: number;
		left_col: number;
		right_col: number;
		top_row: number;
	};
}

export interface RegisterRequest extends Request {
	body: {
		name: string;
		email: string;
		password: string;
	};
}

export interface SigninRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

export interface ImageRequest extends Request {
	body: {
		id: string;
	};
}

export interface ClarifaiRequest extends Request {
	body: {
		url: string;
	};
}

export interface User {
	id: number;
	name: string;
	email: string;
	entries: number;
	joined: Date;
}

export interface Login {
	id: number;
	hash: string;
	email: string;
}

export interface ClarifaiData {
	outputs: {
		data: {
			regions: {
				region_info: BoxType;
			}[];
		};
	}[];
}
