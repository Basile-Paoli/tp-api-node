import "reflect-metadata"
import express from 'express';
import {initHandlers} from "./handlers/handler";
import {AppDataSource} from "./db/database";

async function app() {
	const port = 3000
	const app = express()
	app.use(express.json())
	initHandlers(app)
	try {
		await AppDataSource.initialize()
	} catch (e) {
		console.error(e)
	}
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`)
	})
}

app()