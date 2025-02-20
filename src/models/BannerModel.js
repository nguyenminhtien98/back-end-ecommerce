const mongoose = require('mongoose')
const banner = new mongoose.Schema({
    name: { type: String, require: true },
    image: { type: String, require: true },
    link: { type: String, require: true },
    location: { type: String, require: true },
    status: { type: Boolean, default: true },
}, {
    timestamps: true
})
const Banner = mongoose.model("Banner", banner);
module.exports = Banner;