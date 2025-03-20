import type {Application, Response, Request} from "express";

export function initHandlers(app: Application) {
	app.get('/ping', (req: Request, res: Response) => {
		res.send({
			message: 'bang!'
		})
	})
}