import mongoose from "mongoose"
import ProductModel from "../models/product.model.js"
import mongoDB from "../config/mongoose.config.js"
import fileSystem from "../utils/fileSystem.js"

import { ERROR_INVALID_ID, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js"

export default class ProductsManager {
    #productModel

    constructor () {
        this.#productModel = ProductModel
    }

    getAll = async (paramFilters) => {
        try {
            const $and = []

            if (paramFilters?.title) $and.push({ title:  paramFilters.title })
            if (paramFilters?.category) $and.push({ category:  paramFilters.category })
            if (paramFilters?.status) $and.push({ status:  paramFilters.status })
            const filters = $and.length > 0 ? { $and } : {}
            
            const sort = {
                asc: { price: 1 },
                desc: { price: -1 }
            }

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                lean: true
            }

            const productsFound = await this.#productModel.paginate(filters, paginationOptions)
            return productsFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    getOneById = async (id) => {
        try {
            if(!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const productFound = await this.#productModel.findById(id)

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            return productFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    insertOne = async (data, file) => {
        try {
            const productCreated = new ProductModel(data)
            productCreated.thumbnail = file?.filename ?? null

            await productCreated.save()
            return productCreated
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename)
            
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors[0])
            }

            throw new Error(error.message)
        }
    }

    updateOneById = async (id, data, file) => {
        try {
            if(!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const productFound = await this.#productModel.findById(id)
            const currentThumbnail = productFound.thumbnail
            const newThumbnail = file?.filename

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            productFound.title = data.title
            productFound.description = data.description
            productFound.price = data.price
            productFound.thumbnail = newThumbnail ?? currentThumbnail
            productFound.code = data.code
            productFound.stock = data.stock
            productFound.status = data.status
            productFound.category = data.category

            await productFound.save()

            if(file && newThumbnail != currentThumbnail) {
                await fileSystem.deleteImage(currentThumbnail)
            }

            return productFound
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename)

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0]
            }

            throw new Error(error.message)
        }
    }

    deleteOneById = async (id) => {
        try {
            if(!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const productFound = await this.#productModel.findById(id)

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            await this.#productModel.findByIdAndDelete(id)
            await fileSystem.deleteImage(productFound.thumbnail)

            return productFound
        } catch (error) {
            throw new Error(error.message)
        }
    }
}