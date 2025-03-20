import express from 'express';
import {initHandlers} from "./handlers/handler";

const port = 3000
const app = express()
app.use(express.json())
initHandlers(app)
app.listen(port, () => {
	  console.log(`Server is running on port ${port}`)
})
