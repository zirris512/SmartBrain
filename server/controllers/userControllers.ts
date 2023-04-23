import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import type { SigninRequest, RegisterRequest, User, Login } from "../globalTypes.js";

import db from "../db/index.js";

const SALT = 10;

export const getAllUsers = async (_: Request, res: Response) => {
	try {
		const users = await db<User>("users").select("*");
		res.send(users);
	} catch (error) {
		res.send(error);
	}
};

export const postSignin = async (req: SigninRequest, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json("incorrect email or password");
	}

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
};

export const postRegister = (req: RegisterRequest, res: Response) => {
	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json("incorrect form submission");
	}

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
};

export const getProfile = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		res.status(400).json("invalid id");
	}

	try {
		const foundUser = await db<User>("users").select("*").where("id", id);

		if (foundUser.length === 0) {
			throw "user not found";
		}

		return res.json(foundUser[0]);
	} catch (error) {
		return res.status(404).json(error);
	}
};
