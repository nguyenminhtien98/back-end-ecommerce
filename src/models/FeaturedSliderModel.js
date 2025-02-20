const mongoose = require('mongoose')
const featuredSlider = new mongoose.Schema({
    name: { type: String, require: true },
    image: { type: String, require: true },
    logo: { type: String, require: true },
    slug: { type: String, require: true },
    status: { type: Boolean, default: true },
}, {
    timestamps: true
})
const featured = mongoose.model("featured", featuredSlider);
module.exports = featured;