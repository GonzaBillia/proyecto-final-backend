import { Router } from "express"
import CartsManager from "../managers/cartsManager.js"

import { ERROR_INVALID_ID, ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js"

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID })
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID })
    return res.status(500).json({ status: false, message })
}

const router = Router()
const Manager = new CartsManager()

router.get("/", async (req, res) => {
    try {
        const data = await Manager.getAll(req.query)
        res.status(200).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const data = await Manager.getOneById(req.params.id)
        res.status(200).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

router.post ("/", async (req, res) => {
    try {
        const data = await Manager.insertOne(req.body)
        res.status(201).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

router.put("/:cid", async (req, res) => {
    try {
        const data = await Manager.updateOneById(req.params.cid, req.body)
        res.status(200).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const data = await Manager.addToCart(req.params.cid, req.params.pid)
        res.status(200).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const data = await Manager.deleteOneById(req.params.cid, req.params.pid)
        res.status(200).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const data = await Manager.deleteAll(req.params.cid)
        res.status(200).json({ status: true, payload: data })
    } catch (error) {
        errorHandler(res, error.message)
    }
})

export default router