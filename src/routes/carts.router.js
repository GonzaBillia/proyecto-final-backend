import {Router} from "express"

const router = Router()
const carts = []

//get por id
router.get("/:cid", (req, res) => {
    const {cid} = req.params
    const cart = carts.find(cart => cart.id === cid)
    res.send(cart)
})

//post nuevo carrito
router.post("/", (req, res) => {
    const cart = {
        id: Date.now(),
        products: []
    }
    carts.push(cart)
    res.send(cart)
})

//post agregar producto a carrito
router.post("/:cid/product/:pid", (req, res) => {
    const {cid, pid} = req.params
    const product = req.body
    const cart = carts.find(cart => cart.id === cid)
    cart.products.push(product)
    res.send(cart)
})

export default router