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

	try {
		const foundUser = await db<User>("users")
			.join("login", "users.id", "login.id")
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
				entries: foundUser[0].entries,
			};

			res.json(returnUser);
		});
	} catch (error) {
		console.log(error);
		res.status(400).json("error logging in");
	}
});

router.post("/register", (req: RegisterRequest, res) => {
	const { email, name, password } = req.body;

	bcrypt.hash(password, SALT).then(async (hash) => {
		try {
			await db.transaction(async (trx) => {
				const createdUser = await trx<User>("users")
					.insert({
						name,
						email,
						joined: new Date(),
					})
					.returning("*");
				await trx<Login>("login").insert({
					hash,
					email,
				});
				res.json(createdUser[0]);
			});
		} catch (error) {
			console.log(error);
			res.status(400).json("Could not register user");
		}
	});
});

router.get("/profile/:id", async (req, res) => {
	const { id } = req.params;

	const foundUser = await db<User>("users").select("*").where("id", id);

	if (foundUser.length === 0) {
		return res.status(404).json("no such user");
	}

	return res.json(foundUser[0]);
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

	return res.status(404).json("unable to get entries");
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
