import {Router} from "express"
import productsManager from "../managers/productsManager.js"

const router = Router()
const Manager = new productsManager()

router.get("/", async(req, res) => {
    const products = await (Manager.obtenerTodos())
    res.render("home",{ products: (products)})
})

export default router