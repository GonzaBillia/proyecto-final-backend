import { Server } from "socket.io"

const config = (serverHTTP) => {
    const io = new Server(serverHTTP)

    io.on("connection", (socket) => {
        const id = socket.client.id
        console.log("Se ha conectado un cliente ", id)

        socket.on("saludo", (data)=> {
            console.log(data.message)

            io.emit("respuesta", {message: "Hola cliente!"})
        })

        socket.on("disconnect", () => {
            console.log("Se ha desconectado un cliente ", id)
        })
    })
}

export default {config}