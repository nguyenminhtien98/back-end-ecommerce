const OrderProduct = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");

const createOrderProduct = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderCode,
      orderItems,
      name,
      phone,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
      user,
      status,
      orderDate,
      note,
    } = newOrder;

    try {
      // kiểm tra và cập nhật số lượng sản phẩm
      const updateResults = await Promise.all(
        orderItems.map(async (order) => {
          const productData = await Product.findOneAndUpdate(
            {
              _id: order._idProduct,
              countInstock: { $gte: order.quantity },
            },
            {
              $inc: {
                countInstock: -order.quantity,
                sold: +order.quantity,
              },
            },
            { new: true }
          );
          return productData ? null : order._idProduct; // Nếu productData là null -> hết hàng
        })
      );

      // lọc ra danh sách sản phẩm không đủ hàng
      const outOfStockProducts = updateResults.filter((id) => id !== null);
      if (outOfStockProducts.length > 0) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id ${outOfStockProducts.join(", ")} không đủ hàng`,
        });
      }

      // nếu tất cả sản phẩm đều đủ hàng, tạo một đơn hàng
      const createdOrder = await OrderProduct.create({
        orderCode,
        orderItems,
        name,
        phone,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        totalPrice,
        user,
        status,
        orderDate,
        note,
      });

      if (createdOrder) {
        return resolve({
          status: "OK",
          message: "SUCCESS",
        });
      } else {
        return resolve({
          status: "ERR",
          message: "Không thể tạo đơn hàng",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailOrder = (orderCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Order = await OrderProduct.findOne({
        orderCode: orderCode,
      }).exec();
      if (Order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: Order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrderProduct,
  getDetailOrder,
};
