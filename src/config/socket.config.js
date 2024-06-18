import { Server } from "socket.io"
import productsManager from "../managers/productsManager.js"

let io = null

const Manager = new productsManager()

const config = (serverHTTP) => {
    io = new Server(serverHTTP)

    io.on("connection", async(socket) => {
        const id = socket.client.id
        console.log("Se ha conectado un cliente ", id)

        socket.on("render-products", async() => {
            io.emit("update-list", {products: await Manager.obtenerTodos()})
        })

        socket.on("delete-product", async(data) => {
            const products = await Manager.obtenerTodos()
            const indice = products.findIndex(product => product.id === Number(data.id))

            if(indice < 0) {
                io.emit("not-found", {message: "No se encontro el producto con ese ID"})
                io.emit("update-list", {products: await Manager.obtenerTodos()})
            }else{
                products.splice(indice, 1)
                await Manager.eliminarProducto(products)

                io.emit("update-list", {products: await Manager.obtenerTodos()})
            }
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