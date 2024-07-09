import {Router} from "express"
import productsManager from "../managers/productsManager.js"

const router = Router()
const Manager = new productsManager()

router.get("/", async(req, res) => {
    const products = await (Manager.getAll())
    res.render("home",{ title: "Home", products: products.docs})
})

export default router