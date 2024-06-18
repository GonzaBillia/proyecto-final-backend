import {Router} from "express"
import productsManager from "../managers/productsManager.js"
import io from "../config/socket.config.js"

const router = Router()
const Manager = new productsManager()

router.get("/", async(req, res) => {
    res.render("realTimeProducts")
})

router.post("/", async(req,res)=>{

    const {title, description, price, thumbnail, code, stock, category} = req.body

    const product = {
        id: Date.now(),
        title,
        description,
        price: Number(price),
        thumbnail: Array(thumbnail),
        code,
        stock: Number(stock),
        status: true,
        category
    }

    if(!title || !description || !price || !thumbnail || !code || !stock || !category) {
        io.sendError("Todos los campos son obligatorios")
        return res.status(404).redirect("/realTimeProducts")
    }

    await Manager.addProduct(product)
    io.updateList(await Manager.obtenerTodos())
    res.status(201).redirect("/realTimeProducts")
})

export default router