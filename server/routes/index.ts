import { Router } from "express";
import bcrypt from "bcryptjs";

import type {
	SigninRequest,
	RegisterRequest,
	ImageRequest,
	ClarifaiDataType,
	ClarifaiRequest,
	User,
	Login,
} from "../serverTypes.js";

import connectToDatabase from "../db/index.js";
const db = connectToDatabase();

const SALT = 10;
const MODEL_ID = process.env.MODEL_ID;

const router = Router();

router.get("/", async (req, res) => {
	try {
		const users = await db<User>("users").select("*");
		res.send(users);
	} catch (error) {
		res.send(error);
	}
});

router.post("/signin", async (req: SigninRequest, res) => {
	const { email, password } = req.body;

	const foundUser = await db<User>("users")
		.join(db.ref("login"), "users.id", "login.id")
		.select("users.id", "users.name", "users.entries", "login.hash")
		.where("users.email", email);

	if (foundUser.length === 0) {
		return res.status(400).json("error logging in");
	}

	bcrypt.compare(password, foundUser[0].hash).then((isCorrectPass) => {
		if (!isCorrectPass) {
			return res.status(400).json("error logging in");
		}

		const returnUser = {
			id: foundUser[0].id,
			name: foundUser[0].name,
			email: foundUser[0].email,
		};

		res.json(returnUser);
	});
});

router.post("/register", (req: RegisterRequest, res) => {
	const { email, name, password } = req.body;

	bcrypt.hash(password, SALT).then(async (hash) => {
		try {
			const createdUser = await db<User>("users")
				.insert({
					name,
					email,
					joined: new Date(),
				})
				.returning("*");
			await db<Login>("login").insert({
				hash,
				email,
			});
			res.json(createdUser[0]);
		} catch (error) {
			console.log(error);
			res.status(400).json(error);
		}
	});
});

router.get("/profile/:id", async (req, res) => {
	const { id } = req.params;

	const foundUser = await findUser(id);

	if (foundUser) {
		return res.json(foundUser);
	}

	return res.status(404).json("no such user");
});

router.put("/image", async (req: ImageRequest, res) => {
	const { id } = req.body;

	const updatedUser = await db<User>("users")
		.where("id", id)
		.increment("entries", 1)
		.returning("entries");

	if (updatedUser.length > 0) {
		return res.json(updatedUser[0].entries);
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

async function findUser(id: string) {
	const entries = await db<User>("users").select("*").where("id", id);
	if (entries.length === 0) {
		return null;
	}
	return entries[0];
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
