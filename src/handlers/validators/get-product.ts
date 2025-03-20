import Joi from "joi";

export interface ProductId {
	id: number
}

export const GetProductValidation = Joi.object<ProductId>({
	id: Joi.number().required()
})