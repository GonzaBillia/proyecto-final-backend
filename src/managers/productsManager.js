import fs from "fs"
import path from "path"

export default class productsManager {
    #rutaArchivoProductsJSON
    constructor() {
        this.#rutaArchivoProductsJSON = path.join(path.basename("src"), "files", "products.json")
    }

    #obtenerProductos = async () => {
        //validacion de existencia de archivo
        if(!fs.existsSync(this.#rutaArchivoProductsJSON)) {
            await fs.promises.writeFile(this.#rutaArchivoProductsJSON, "[]")
        }

        //Carga de contenido y retorno de archivo JSON
        const productosJSON = await fs.promises.readFile(this.#rutaArchivoProductsJSON, "utf-8")
        
        //JSON a array y retorno
        return JSON.parse(productosJSON)
    }

    #persistirProducto = async (nuevoProducto) => {
        const productos = await this.#obtenerProductos()

        //Agrega nuevo producto
        productos.push(nuevoProducto)

        //Convierte a JSON y sobreescribe el archivo
        const productosActualizadosJSON = JSON.stringify(productos, null, "\t")
        await fs.promises.writeFile(this.#rutaArchivoProductsJSON, productosActualizadosJSON)
    }

    async addProduct(product) {
        await this.#persistirProducto(product)
    }

    async obtenerTodos() {
        return await this.#obtenerProductos()
    }

}