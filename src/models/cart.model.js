import { Schema, model } from "mongoose"
import paginate from "mongoose-paginate-v2"

const cartSchema = new Schema({
    products: {
        type: [Schema.Types.ObjectId],
        quantity: {
            type: Number,
            default: 1
        },
        ref: "products"
    }
},{
    timestamps: true
})

//Plugin Paginate
cartSchema.plugin(paginate)

const CartModel = model("carts", cartSchema)

export default CartModel