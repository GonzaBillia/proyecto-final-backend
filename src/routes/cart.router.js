import { Router } from "express"
import CartsManager from "../managers/cartsManager.js"

const router = Router()
const Manager = new CartsManager()

router.get("/:id", async (req, res) => {
    const cart = await (Manager.getOneById(req.params.id))
    res.render("cart", {
        _id: cart._id,
        products: cart.products
    })
})

export default router