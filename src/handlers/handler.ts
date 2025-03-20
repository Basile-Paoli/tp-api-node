import type {Application, Response, Request} from "express";
import {GetProductValidation} from "./validators/get-product";
import {constants} from "node:http2";
import {AppDataSource} from "../db/database";
import {Product} from "../db/models/product";

const {HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR} = constants

export function initHandlers(app: Application) {
	app.get('/ping', (req, res) => {
		res.send({
			message: 'bang!'
		})
	})

	app.get('/products/:id', async (req, res) => {
		try {
			const validation = GetProductValidation.validate(req.params)
			if (validation.error) {
				res.status(HTTP_STATUS_BAD_REQUEST).send(validation.error.details)
				return
			}

			const getProductRequest = validation.value
			const productRepository = AppDataSource.getRepository(Product)
			const product = await productRepository.findOne({
				where: {id: getProductRequest.id}
			})
			if (!product) {
				res.status(HTTP_STATUS_NOT_FOUND).send({
					message: 'Product not found'
				})
				return
			}

			res.send(product)
		} catch (e) {
			console.error(e)
			res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
				message: 'Internal server error'
			})
		}
	})
}