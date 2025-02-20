const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    image: { type: Array, require: true },
    clb: { type: String },
    category: { type: String, require: true },
    parent: { type: String, require: true },
    parent_slug: { type: String, require: true },
    price: { type: Number, require: true },
    productNew: { type: Boolean },
    sale: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    countInstock: { type: Number, require: true },
    size: { type: Array, default: [], require: true },
    rating: { type: Number },
    trending: { type: Boolean },
    story: { type: String },
    description_story: { type: String },
    status: { type: Boolean, default: true },
    description: { type: String },
}, {
    timestamps: true
})
const Product = mongoose.model("Product", productSchema);
module.exports = Product;