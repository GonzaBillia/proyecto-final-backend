import express from "express"
import path from "./utils/path.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import serverSocket from "./config/socket.config.js"
import viewsRouter from "./routes/views.router.js"
import homeRouter from "./routes/home.router.js"
import handlebarsConfig from "./config/handlebars.config.js"
import mongoDB from "./config/mongoose.config.js"

const app = express()
const PORT = 8080
const HOST = "localhost" //127.0.0.1

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//ruta estatica
app.use("/api/public", express.static(path.public))

//routers
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/realtimeproducts", viewsRouter)
app.use("/", homeRouter)

//handlebars
handlebarsConfig.config(app)

// Control de rutas inexistentes
server.use("*", (req, res) => {
    res.status(500).send(`<h1>Error 404</h1><h3>${ERROR_NOT_FOUND_URL.message}</h3>`);
});

// Control de errores internos
server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER.message}</h3>`);
});

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});

//socket.io
serverSocket.config(serverHTTP)
