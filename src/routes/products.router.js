import {Router} from "express"

const router = Router()
const products = []

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
    products.push(product)
    res.send(product)
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