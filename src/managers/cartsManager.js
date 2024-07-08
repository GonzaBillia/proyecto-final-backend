import mongoose from "mongoose"
import CartModel from "../models/cart.model.js"
import mongoDB from "../config/mongoose.config.js"

import { ERROR_INVALID_ID, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js"

export default class CartsManager {
    #cartModel

    constructor () {
        this.#cartModel = CartModel
    }

    getAll = async () => {
        try {
            const sort = {
                asc: { name: 1 },
                desc: { name: -1 },
            };

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                populate: "products",
                lean: true,
            };

            const cartsFound = await this.#cartModel.paginate({},paginationOptions);
            return cartsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.findById(id)

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            return cartFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    insertOne = async () => {
        try {
            const newCart = new CartModel()

            await newCart.save()
            return newCart
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0]
            }

            throw new Error(error.message)
        }
    }

    addToCart = async (cid, pid) => {
        try {
            if(cid !== null || cid !== undefined){
                if(!mongoDB.isValidID(cid) || !mongoDB.isValidID(pid)) {
                    throw new Error(ERROR_INVALID_ID)
                }
            } else if (cid === null || cid === undefined) {
                try {
                    const productFound = await this.#cartModel.getOneById(pid)
                
                    if (!productFound) {
                        throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
                    }

                    const newCart = await this.insertOne()

                    newCart.products.push(productFound)
                    await newCart.save()
                    return newCart
                } catch (error) {
                    if (error instanceof mongoose.Error.ValidationError) {
                        error.message = Object.values(error.errors)[0]
                    }
        
                    throw new Error(error.message)
                }
            } else {
                const cartFound = await this.#cartModel.getOneById(cid)
                const productFound = await this.#cartModel.getOneById(pid)
        
                if (!cartFound) {
                    throw new Error(ERROR_NOT_FOUND_ID + "value: Cart")
                }
        
                if (!productFound) {
                    throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
                }

                const isNewProduct = cartFound.forEach(product => {
                    if(product.id == pid) {return false}
                    else {return true}
                })
        
                if(isNewProduct) {
                    cartFound.products.push(productFound)
                    await cartFound.save()
                    return cartFound
                } else {
                    const index = cartFound.products.findIndex(product => product._id == pid)

                    cartFound.products[index].quantity += 1
                    await cartFound.save()
                    return cartFound
                }
            }
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0]
            }

            throw new Error(error.message)
        }
    }

    deleteOneById = async (cid, pid) => {
        try {
            if(!mongoDB.isValidID(pid) || !mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.getOneById(cid)
            const productFound = await this.#cartModel.getOneById(pid)

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Cart")
            }
    
            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
            }

            cartFound.products.pull(productFound)
            await cartFound.save()
            return cartFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    deleteAll = async (id) => {
        try {
            if(!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.getOneById(id)

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Cart")
            }

            cartFound.products = []
            await cartFound.save()
            return cartFound
        } catch (error) {
            throw new Error(error.message)
        }
    }
}