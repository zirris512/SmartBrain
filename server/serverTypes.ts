import { Request } from "express";

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

interface BoxType {
	bounding_box: {
		bottom_row: number;
		left_col: number;
		right_col: number;
		top_row: number;
	};
}

export interface ClarifaiDataType {
	outputs: {
		data: {
			regions: {
				region_info: BoxType;
			}[];
		};
	}[];
}
