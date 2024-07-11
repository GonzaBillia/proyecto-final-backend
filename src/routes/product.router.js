import {Router} from "express"
import productsManager from "../managers/productsManager.js"

const router = Router()
const Manager = new productsManager()

router.get("/:id", async(req, res) => {
    const product = await (Manager.getOneById(req.params.id))
    res.render("product",
        { title: product.title, 
            description: product.description, 
            price: product.price, 
            thumbnail: product.thumbnail, 
            stock: product.stock, 
            brand: product.brand, 
            code: product.code, 
            category: product.category,
            model: product.model})
})

export default router