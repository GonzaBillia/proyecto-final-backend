import { Schema, model } from "mongoose"
import _ from "mongoose-paginate-v2"
import paginate from "mongoose-paginate-v2"

const cartSchema = new Schema({
    products:[ 
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number
            },
            _id: false
        }
    ],
},{
    timestamps: true
})

//Plugin Paginate
cartSchema.plugin(paginate)

const CartModel = model("carts", cartSchema)

export default CartModel