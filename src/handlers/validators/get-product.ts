import Joi from "joi";

export interface ProductId {
	id: number
}

export const GetProductValidation = Joi.object<ProductId>({
	id: Joi.number().required()
})


export interface ProductsQuery {
	name: string
	page: number
	size: number
}

export const GetProductsQueryValidation = Joi.object<ProductsQuery>({
	name: Joi.string().optional(),
	page: Joi.number().integer().optional().default(1),
	size: Joi.number().integer().optional().default(10)

})