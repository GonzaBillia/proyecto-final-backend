
const socket = io()

const productsList = document.getElementById("products-list")
const btnDelete = document.getElementById("delete-product")
const inputId = document.getElementById("id")

socket.on("connect", () => {
    socket.emit("render-products")
})

btnDelete.onclick = () => {
    const id = Number(inputId.value)

    if(id > 0) {
        socket.emit("delete-product", {id})
        inputId.value = ""
    }
}

socket.on("not-found", (data) => {
    alert(data.message)
})

socket.on("update-list", (data) => {

    const productsL = data.products ?? []
    productsList.innerHTML = ""
    productsL.forEach((product) => {
        const title = document.createElement("li")
        const id = document.createElement("li")
        const description = document.createElement("li")
        const price = document.createElement("li")
        const code = document.createElement("li")
        const stock = document.createElement("li")
        const category = document.createElement("li")
        const desc = document.createElement("ul")

        title.innerHTML = `title: ${product.title}`
        id.innerHTML = `id: ${product.id}`
        description.innerHTML = `description: ${product.description}`
        price.innerHTML = `price: ${product.price}`
        code.innerHTML = `code: ${product.code}`
        stock.innerHTML = `stock: ${product.stock}`
        category.innerHTML = `category: ${product.category}`

        desc.append(id, description, price, code, stock, category)

        productsList.append(title, desc)

    })
})

