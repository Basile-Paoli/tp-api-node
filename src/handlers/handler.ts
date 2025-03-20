import type {Application} from "express";
import {GetProductsQueryValidation, GetProductValidation} from "./validators/get-product";
import {constants} from "node:http2";
import {AppDataSource} from "../db/database";
import {Product} from "../db/models/product";
import {CreateProductValidation} from "./validators/create-product";
import {generateValidationErrorMessage} from "./validators/generate-validation-message";

const {HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NO_CONTENT} = constants

export function initHandlers(app: Application) {
	app.get('/ping', (req, res) => {
		res.send({
			message: 'bang!'
		})
	})

	app.get('/products', async (req, res) => {
		try {
			const validation = GetProductsQueryValidation.validate(req.query)
			if (validation.error) {
				res.status(400).send(generateValidationErrorMessage(validation.error.details))
				return
			}
			const {name, page, size} = validation.value
			const productRepository = AppDataSource.getRepository(Product)
			const products = await productRepository.find({
				where: {name: name},
				skip: (page - 1) * size,
				take: size
			})
			res.send(products)
		} catch (e) {
			console.error(e)
			res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
				message: 'Internal server error'
			})
		}
	})

	app.get('/products/:id', async (req, res) => {
		try {
			const validation = GetProductValidation.validate(req.params)
			if (validation.error) {
				res.status(400).send(generateValidationErrorMessage(validation.error.details))
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

	app.post("/products", async (req, res) => {
		try {
			const validation = CreateProductValidation.validate(req.body)
			if (validation.error) {
				res.status(400).send(generateValidationErrorMessage(validation.error.details))
				return
			}
			const createProductRequest = validation.value

			const productRepository = AppDataSource.getRepository(Product)
			const product = productRepository.create({...createProductRequest})
			const productCreated = await productRepository.save(product);

			res.status(201).send(productCreated)
		} catch (error) {
			if (error instanceof Error) {
				console.log(`Internal error: ${error.message}`)
			}
			res.status(500).send({message: "internal error"})
		}
	})

	app.patch("/products/:id", async (req, res) => {
		try {
			const productIdValidation = GetProductValidation.validate(req.params)
			if (productIdValidation.error) {
				res.status(400).send(generateValidationErrorMessage(productIdValidation.error.details))
				return
			}
			const productId = productIdValidation.value

			const requestValidation = CreateProductValidation.validate(req.body)
			if (requestValidation.error) {
				res.status(400).send(generateValidationErrorMessage(requestValidation.error.details))
				return
			}
			const patchProductRequest = requestValidation.value

			const productRepository = AppDataSource.getRepository(Product)
			const updateResult = await productRepository.update(productId.id, patchProductRequest)
			if (updateResult.affected === 0) {
				res.status(404).send({message: "Product not found"})
				return
			}

			res.status(HTTP_STATUS_NO_CONTENT).send()
		} catch (e) {
			console.error(e)
			res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
				message: 'Internal server error'
			})
		}
	})


	app.delete("/products/:id", async (req, res) => {
		try {
			const validation = GetProductValidation.validate(req.params)
			if (validation.error) {
				res.status(400).send(generateValidationErrorMessage(validation.error.details))
				return
			}
			const getProductRequest = validation.value

			const productRepository = AppDataSource.getRepository(Product)

			const deleteResult = await productRepository.delete({
				id: getProductRequest.id
			})

			if (deleteResult.affected === 0) {
				res.status(HTTP_STATUS_NOT_FOUND).send({
					message: 'Product not found'
				})
				return
			}
			res.status(HTTP_STATUS_NO_CONTENT).send()
		} catch (e) {
			console.error(e)
			res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
				message: 'Internal server error'
			})
		}
	})
}