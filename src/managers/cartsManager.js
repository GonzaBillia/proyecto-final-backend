import mongoose from "mongoose"
import CartModel from "../models/cart.model.js"
import ProductModel from "../models/product.model.js"
import mongoDB from "../config/mongoose.config.js"

import { ERROR_INVALID_ID, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js"

export default class CartsManager {
    #cartModel
    #productModel

    constructor() {
        this.#cartModel = CartModel
        this.#productModel = ProductModel
    }

    // devuelve la lista completa de carritos, paginado y con posibilidad de ordenarlos
    getAll = async (paramFilters) => {
        try {
            const sort = {
                asc: { name: 1 },
                desc: { name: -1 },
            };

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                populate: "products.item",
                lean: true,
            };

            const cartsFound = await this.#cartModel.paginate({}, paginationOptions)
            return cartsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // devuelve un carrito por su id
    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.findById(id).populate("products.item").lean()

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID)
            }

            return cartFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // inserta un nuevo carrito vacio
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

    // agrega un producto al carrito
    addToCart = async (cid, pid, quantity, data) => {
        try {
            // Si existe un id de carrito y un id de producto entra al if
            if (cid !== null || cid !== undefined && pid !== null || pid !== undefined) {
                if (!mongoDB.isValidID(cid) || !mongoDB.isValidID(pid)) {
                    throw new Error(ERROR_INVALID_ID)
                }

                const cartFound = await this.#cartModel.findById(cid)
                const productFound = await this.#productModel.findById(pid)

                if (!cartFound) {
                    throw new Error(ERROR_NOT_FOUND_ID + "value: Cart")
                }

                if (!productFound) {
                    throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
                }

                // Verifica si el producto ya existe en el carrito
                const isNewProduct = !cartFound.products.some(product => product.item == pid)

                // Si es nuevo lo agrega, sino, lo sobrescribe con su nueva cantidad
                if (isNewProduct) {
                    cartFound.products.push({ item: productFound, quantity: quantity })
                    await cartFound.save()
                    return cartFound
                } else {
                    const index = cartFound.products.findIndex(product => product.item == pid)

                    cartFound.products[index].item = productFound
                    cartFound.products[index].quantity = quantity
                    await cartFound.save()

                    return cartFound
                }

            // Si no existe un id de carrito, lo crea y luego añade el producto
            } else if (cid === null || cid === undefined && pid !== null || pid !== undefined) {
                try {
                    const productFound = await this.#productModel.findById(pid)

                    if (!productFound) {
                        throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
                    }

                    if (quantity === undefined) {
                        quantity = 1
                    }

                    const newCart = await this.insertOne()

                    newCart.products.push({ item: productFound, quantity: quantity })
                    await newCart.save()
                    return newCart
                } catch (error) {
                    if (error instanceof mongoose.Error.ValidationError) {
                        error.message = Object.values(error.errors)[0]
                    }

                    throw new Error(error.message)
                }
            } else {
                throw new Error(ERROR_INVALID_ID)
            }
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0]
            }

            throw new Error(error.message)
        }
    }

    // actualiza el carrito con el array de productos que pase por body
    updateOneById = async (cid, data) => {
        try {
            if (!mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.findById(cid)

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Cart")
            }

            data.products.forEach(product => {
                cartFound.products.push({ item: product.item, quantity: product.quantity })

            })
            await cartFound.save()
            return cartFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // Elimina un producto del carrito
    deleteOneById = async (cid, pid) => {
        try {
            if (!mongoDB.isValidID(pid) || !mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.findById(cid)
            const productFound = await this.#productModel.findById(pid)

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Cart")
            }

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
            }

            const index = cartFound.products.findIndex(product => product.item == pid)

            if (index == -1) {
                throw new Error(ERROR_NOT_FOUND_ID + "value: Product")
            }

            cartFound.products.splice(index, 1)
            await cartFound.save()
            return cartFound
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // Vacia el Carrito seleccionado
    deleteAll = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID)
            }

            const cartFound = await this.#cartModel.findById(id)

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