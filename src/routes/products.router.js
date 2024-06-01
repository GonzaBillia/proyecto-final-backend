import {Router} from "express"
import productsManager from "../managers/productsManager"

const router = Router()
const products = new productsManager()

//Get todos los productos
router.get("/", (req, res) => {
    res.send({products})
})

//get producto por id
router.get("/:pid", (req, res) => {
    const {id} = req.params
    const product = products.find(product => product.id === id)
    res.send(product)
})

//post nuevo producto
router.post("/", (req, res) => {
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

    products.addProduct(product)
    
    return res.status(201).send({status: "Success", message: "Producto agregado", data: product})
})

//put proyecto por id
router.put("/:pid", (req, res) => {
    const {id} = req.params
    const {title, description, price, thumbnail, code, stock, status, category} = req.body
    const product = products.find(product => product.id === id)
    product.title = title
    product.description = description
    product.price = price
    product.thumbnail = thumbnail
    product.code = code
    product.stock = stock
    product.status = status
    product.category = category
    res.send({product})
})

//delete proyecto por id
router.delete("/:pid", (req, res) => {
    const {id} = req.params
    const product = products.find(product => product.id === id)
    const index = products.indexOf(product)
    products.splice(index, 1)
    res.send({product})
})

export default router