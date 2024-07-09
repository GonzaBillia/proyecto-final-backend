import {Router} from "express"
import productsManager from "../managers/productsManager.js"
import io from "../config/socket.config.js"
import uploader from "../utils/uploader.js"

const router = Router()
const Manager = new productsManager()

router.get("/", async(req, res) => {
    res.render("realTimeProducts")
})

router.post("/", uploader.single("file"), async(req,res)=>{
    try {
        const { file } = req
        await Manager.insertOne(req.body, file)
        const products = await Manager.getAll()
        io.updateList(products)
        res.status(201).redirect("/realTimeProducts")
    } catch (error) {
        return res.status(404).redirect("/realTimeProducts")
    }
})

export default router