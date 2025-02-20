const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: { type: String, require: true },
    slug: { type: String, require: true },
    image: { type: String },
    subMenu: { type: Array, default: undefined }
}, {
    timestamps: true
})
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;