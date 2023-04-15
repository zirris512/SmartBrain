import { Router } from "express";
import bcrypt from "bcryptjs";

import db from "../db/index.js";

import type {
	SigninRequest,
	RegisterRequest,
	ImageRequest,
	ClarifaiDataType,
	ClarifaiRequest,
} from "../serverTypes.js";

const SALT = 10;
const MODEL_ID = process.env.MODEL_ID;

const router = Router();

let id = 2;

router.get("/", (req, res) => {
	res.send(db.users);
});

router.post("/signin", (req: SigninRequest, res) => {
	const { email, password } = req.body;

	const foundUser = db.users.find((user) => user.email === email);

	if (!foundUser) {
		return res.status(400).json("error logging in");
	}

	bcrypt.compare(password, foundUser.password).then((isCorrectPass) => {
		if (!isCorrectPass) {
			return res.status(400).json("error logging in");
		}
		res.json({ ...foundUser, password: null });
	});
});

router.post("/register", (req: RegisterRequest, res) => {
	const { email, name, password } = req.body;

	bcrypt.hash(password, SALT).then((hash) => {
		db.users.push({
			id,
			name,
			email,
			password: hash,
			entries: 0,
			joined: new Date(),
		});
		res.json({ ...db.users.at(-1), password: null });
		id++;
	});
});

router.get("/profile/:id", (req, res) => {
	const { id } = req.params;

	const foundUser = findUser(id);

	if (foundUser) {
		return res.json({ ...foundUser, password: null });
	}

	return res.status(404).json("no such user");
});

router.put("/image", (req: ImageRequest, res) => {
	const { id } = req.body;

	const foundUser = findUser(id);

	if (foundUser) {
		foundUser.entries++;
		return res.json(foundUser.entries);
	}
	return res.status(404).json("no such user");
});

router.post("/clarifai", (req: ClarifaiRequest, res) => {
	const { url } = req.body;
	const requestOptions = setupClarifai(url);

	fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
		.then((response) => {
			return response.json();
		})
		.then((result: ClarifaiDataType) => {
			const imageRegion = result.outputs[0].data.regions?.[0];
			if (!imageRegion) {
				return res.status(400).json("error finding face in image");
			}
			res.json(imageRegion.region_info);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

function findUser(id: string) {
	for (const user of db.users) {
		if (user.id === +id) {
			return user;
		}
	}
	return null;
}

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

export default router;
