import {Router} from "express"
import cartsManager from "../managers/cartsManager.js"
import productsManager from "../managers/productsManager.js"

const router = Router()
const Manager = new cartsManager()
const ProductManager = new productsManager()

//get por id
router.get("/:cid", async (req, res) => {
    const {cid} = req.params
    const cart = await Manager.getCartById(cid)
    
    if(cart === undefined) {
        return res.status(404).send({status: "Error", message: "No se encontro el carrito"})
    }else{
        return res.status(200).send({status: "Success", message: "Carrito encontrado", data: cart})
    }
})

//post nuevo carrito
router.post("/", async (req, res) => {
    const cart = {
        id: Date.now(),
        products: []
    }
    
    await Manager.addCart(cart)
    
    return res.status(201).send({status: "Success", message: "Carrito agregado", data: cart})
})

//post agregar producto a carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = req.params

    if(await Manager.getCartById(cid) === undefined) {
        return res.status(404).send({status: "Error", message: "No se encontro el carrito"})
    }else if(await ProductManager.obtenerPorId(pid) === undefined) {
        return res.status(404).send({status: "Error", message: "No se encontro el producto"})
    }else{
        const cart = await Manager.addToCart(cid, pid)
        return res.status(201).send({status: "Success", message: "Producto agregado al carrito", data: cart})
    }

})

export default router