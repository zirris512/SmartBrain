import "./loadEnv.js";
import express from "express";
import cors from "cors";

import router from "./routes/index.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(3001, () => {
	console.log("listening on port 3001");
});
