import "./loadEnv.js";
import express from "express";
import cors from "cors";
import url from "url";

import router from "./routes/routes.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
	const staticBuildPath = url.fileURLToPath(new URL("../../SmartBrain/dist", import.meta.url));

	app.use(express.static(staticBuildPath));
	app.get("*", (_, res) => {
		res.sendFile(staticBuildPath + "/index.html");
	});
}

app.use("/api", router);

app.listen(3001, () => {
	console.log("listening on port 3001");
});
