import fs from "fs"
import path from "path"

export default class cartsManager{
    #rutaArchivoCartsJSON
    constructor() {
        this.#rutaArchivoCartsJSON = path.join(path.basename("src"), "files", "carts.json")
    }

    #obtenerCarts = async () => {
        //validacion de existencia de archivo
        if(!fs.existsSync(this.#rutaArchivoCartsJSON)) {
            await fs.promises.writeFile(this.#rutaArchivoCartsJSON, JSON.stringify([]))
        }

        //Carga de contenido y retorno de archivo JSON
        const cartsJSON = await fs.promises.readFile(this.#rutaArchivoCartsJSON, "utf-8")

        //JSON a array y retorno
        return JSON.parse(cartsJSON)
    }

    #persistirCarts = async (nuevoCart) => {
        const carts = await this.#obtenerCarts()

        //Agrega nuevo producto
        carts.push(nuevoCart)

        const cartsActualizadosJSON = JSON.stringify(carts, null, "\t")
        await fs.promises.writeFile(this.#rutaArchivoCartsJSON, cartsActualizadosJSON)
    }

    #reescribirCarts = async (arrayCarts) => {
        const cartsActualizadosJSON = JSON.stringify(arrayCarts, null, "\t")
        await fs.promises.writeFile(this.#rutaArchivoCartsJSON, cartsActualizadosJSON)
    }

    addCart = async (nuevoCart) => {
        await this.#persistirCarts(nuevoCart)
    } 

    getCartById = async (cid) => {
        const carts = await this.#obtenerCarts()
        const cart = await carts.find(cart => cart.id === Number(cid))
        return cart 
    }

    addToCart = async (cid, pid) => {
        const carts = await this.#obtenerCarts()
        const cart = await carts.find(cart => cart.id === Number(cid))
        const index = await carts.indexOf(cart)

        const product = cart.products.find(product => product.id === Number(pid))

        if(product){
            const productIndex = cart.products.indexOf(product)
            cart.products[productIndex].quantity++
            carts[index] = cart
            await this.#reescribirCarts(carts)
            return cart
        }else{
            const nuevoProducto = {
                id: Number(pid),
                quantity: 1
            }
    
    
            cart.products.push(nuevoProducto)
            carts[index] = cart
            await this.#reescribirCarts(carts)
            return cart
        }
    }
}