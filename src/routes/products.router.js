import {Router} from "express"
import productsManager from "../managers/productsManager.js"

const router = Router()
const Manager = new productsManager()

//Get todos los productos
router.get("/", async (req, res) => {
    const {limit} = req.query
    if(limit !== undefined) {
        const products = Manager.obtenerTodos(limit)
        return res.status(200).send({state: "success", data: products})
    }

    const products = await Manager.obtenerTodos()
    return res.status(200).send({state: " this success", data: products})
})

//get producto por id
router.get("/:pid", async (req, res) => {
    const {pid} = req.params
    const product = await Manager.obtenerPorId(pid)

    if(product === undefined) {
        return res.status(404).send({status: "Error", message: "No se encontro el producto"})
    }

    return res.status(200).send({status: "Success", message: "Producto encontrado", data: product})
})

//post nuevo producto
router.post("/", async (req, res) => {
    const {title, description, price, thumbnail, code, stock, category} = req.body
    const product = {
        id: Date.now(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status: true,
        category
    }

    if(!title || !description || !price || !thumbnail || !code || !stock || !category) {
        return res.status(400).send({status: "Error", message: "Todos los campos son obligatorios"})
    }

    await Manager.addProduct(product)
    
    return res.status(201).send({status: "Success", message: "Producto agregado", data: product})
})

//put proyecto por id
router.put("/:pid", async (req, res) => {
    const {id} = req.params
    const {title, description, price, thumbnail, code, stock, status, category} = req.body
    const products = await Manager.obtenerTodos()
    const indice = await products.findIndex(product => product.id === Number(id))

    if(indice >= 0) {
        return res.status(404).send({status: "Error", message: "No se encontro el producto"})
    }

    if(!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
        return res.status(400).send({status: "Error", message: "Todos los campos son obligatorios"})
    }

    products[indice] = {
        title,
        description,
        price,
        thumbnail: [thumbnail],
        code,
        stock,
        status,
        category
    }

    return res.status(200).send({status: "Success", message: "Producto actualizado", data: products[indice]})

})

//delete proyecto por id
router.delete("/:pid", async (req, res) => {
    const {id} = req.params
    const products = await Manager.obtenerTodos()
    const indice = await products.findIndex(product => product.id === Number(id))

    if(indice >= 0) {
        return res.status(404).send({status: "Error", message: "No se encontro el producto"})
    }

    products.splice(indice, 1)
    await Manager.eliminarProducto(products)
    return res.status(200).send({status: "Success", message: "Producto eliminado", data: products})
})

export default router