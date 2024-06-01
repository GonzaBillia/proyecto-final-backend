import express from "express"
import path from "path"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

const app = express()
const PORT = 8080
const HOST = "localhost" //127.0.0.1

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//ruta estatica
app.use("/api/public", express.static(path.join("src", "public")))

//routers
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//control de rutas inexistentes
app.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL a la que intentas acceder no existe</h3>")
})

//Control de errores internos de servidor
app.use((err, req, res) => {
    console.log("ERROR: ", err.message)
    res.status(500).send("<h1>Error 500</h1><h3>Hubo un error en el servidor</h3>")
})

//servidor
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
})