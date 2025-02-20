const mongoose = require('mongoose')
const Featured = new mongoose.Schema({
    name: { type: String, require: true },
    image: { type: String, require: true },
    logo: { type: String},
    link: { type: String},
    slide: {type: Boolean, default: true},
    status: { type: Boolean, default: true },
    code: {type: String}
}, {
    timestamps: true
})
const featured = mongoose.model("featured", Featured);
module.exports = featured;