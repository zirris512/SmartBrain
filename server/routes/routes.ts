import { Router } from "express";

import {
	postRegister,
	postSignin,
	getProfile,
	getAllUsers,
} from "../controllers/userControllers.js";
import { postClarifai, updateEntries } from "../controllers/clarifaiControllers.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/signin", postSignin);
router.post("/register", postRegister);
router.get("/profile/:id", getProfile);

router.put("/image", updateEntries);
router.post("/clarifai", postClarifai);

export default router;
