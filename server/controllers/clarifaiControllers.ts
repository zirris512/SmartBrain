import { Response } from "express";

import db from "../db/index.js";

import type { ClarifaiData, ClarifaiRequest, ImageRequest, User } from "../serverTypes.js";

const MODEL_ID = process.env.MODEL_ID;

export const postClarifai = (req: ClarifaiRequest, res: Response) => {
	const { url } = req.body;
	const requestOptions = setupClarifai(url);

	fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
		.then((response) => {
			return response.json();
		})
		.then((result: ClarifaiData) => {
			if (Object.keys(result.outputs[0].data).length === 0) {
				throw "image does not contain any faces";
			}
			const faceLocations = result.outputs[0].data.regions.map((region) => {
				return region.region_info.bounding_box;
			});
			res.json(faceLocations);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
};

export const updateEntries = async (req: ImageRequest, res: Response) => {
	const { id } = req.body;

	const updatedUser = await db<User>("users")
		.where("id", id)
		.increment("entries", 1)
		.returning("entries");

	if (updatedUser.length > 0) {
		return res.json(updatedUser[0].entries);
	}

	return res.status(404).json("unable to get entries");
};

function setupClarifai(imageURL: string) {
	const PAT = process.env.PAT;
	const USER_ID = process.env.USER_ID;
	const APP_ID = process.env.APP_ID;

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: imageURL,
					},
				},
			},
		],
	});

	return {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: "Key " + PAT,
		},
		body: raw,
	};
}
