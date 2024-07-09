import { Server } from "socket.io"
import ProductsManager from "../managers/productsManager.js"

let io = null

const Manager = new ProductsManager()

const config = (serverHTTP) => {
    io = new Server(serverHTTP)

    io.on("connection", async(socket) => {
        const id = socket.client.id
        console.log("Se ha conectado un cliente ", id)

        socket.on("render-products", async() => {
            const products = await Manager.getAll()
            io.emit("update-list", {products: products.docs})
        })

        socket.on("delete-product", async(data) => {
            await Manager.deleteOneById(data)
            const products = await Manager.getAll()
            io.emit("update-list", {products: products.docs})
        })

        socket.on("disconnect", () => {
            console.log("Se ha desconectado un cliente ", id)
        })
    })
}

const updateList = (products) => {
    io.emit("update-list", {products})
}

const sendError = (message) => {
    io.emit("not-found", {message})
}

export default {config, updateList, sendError}