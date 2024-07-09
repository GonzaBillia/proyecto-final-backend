import { Schema, model } from "mongoose"
import paginate from "mongoose-paginate-v2"

const productSchema = new Schema({
    title: {
        type: String,
        required: [ true, "El titulo es Obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 5, "El titulo debe tener al menos 5 caracteres" ],
        maxLength: [ 100, "El titulo debe tener como maximo 100 caracteres" ]
    },
    description: {
        type: String,
        required: [ true, "La descripción es Obligatoria" ],
        trim: true
    },
    price: {
        type: Number,
        required: [ true, "El precio es obligatorio" ],
        min: [ 0, "El precio debe ser mayor a 0" ]
    },
    thumbnail: {
        type: String,
        required: [ true, "El thumbnail es obligatorio" ],
        trim: true
    },
    code: {
        type: String,
        required: [ true, "El Código es obligatorio" ],
        trim: true,
        unique: true
    },
    stock: {
        type: Number,
        required: [ true, "El stock es obligatorio" ],
        min: [ 0, "El stock debe ser mayor a 0" ]
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: [ true, "La categoria es obligatoria" ],
        trim: true,
        uppercase: true
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

//Relacion Virtual
productSchema.virtual("carts", {
    ref: "carts",
    localField: "_id",
    foreignField: "products",
    justOne: false
})

//Middleware elimina la ref en los products al eliminar el cart
productSchema.pre("remove", async function(next) {
    const cartModel = this.model("carts")

    await cartModel.updateMany({products: this._id}, {$pull: {products: this._id}})

    next()
})

//Plugin Paginate
productSchema.plugin(paginate)

const ProductModel = model("products", productSchema)

export default ProductModel