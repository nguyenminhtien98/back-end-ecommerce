const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderCode: {type: String, require: true},
    orderItems: {type: Array, require: true},
    name: {type: String, require: true},
    phone: {type: Number, require: true},
    shippingAddress: {type: String, require: true},
    paymentMethod: {type: String, require: true},
    shippingPrice: {type: Number, default: 0},
    totalPrice: {type: Number, require: true},
    user: {type: Array },
    status: {type: String, default: "Đang chuẩn bị hàng"},
    orderDate: {type: String, require: true},
    note: {type: String}
},
    {
        timestamps: true
    }
)
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;