const OrderProductService = require("../services/OrderProductService");
const JwtService = require("../services/JwtService");

const createOrderProduct = async (req, res) => {
  try {
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
    } = req.body;
    if (
      !orderCode ||
      !orderItems ||
      !name ||
      !phone ||
      !shippingAddress ||
      !paymentMethod ||
      !totalPrice ||
      !orderDate
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderProductService.createOrderProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// const loginUser = async(req, res) => {
//     try {
//         const { email, password } = req.body
//         const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//         const isCheckEmail = reg.test(email)
//         if (!email || !password) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is required'
//             })
//         } else if (!isCheckEmail) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is email'
//             })
//         }
//         const response = await UserService.loginUser(req.body)
//         const {refresh_token, ...newResponse} = response
//         res.cookie('refresh_token', refresh_token, {
//             httpOnly: true,
//             secure: false,
//             samesite: 'strict'
//         })
//         return res.status(200).json(newResponse)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

// const updateUser = async(req, res) => {
//     try {
//         const userId = req.params.id
//         const data = req.body
//         if (!userId) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The userId is required'
//             })
//         }
//         const response = await UserService.updateUser(userId, data)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

// const deleteUser = async(req, res) => {
//     try {
//         const userId = req.params.id
//         if (!userId) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The userId is required'
//             })
//         }
//         const response = await UserService.deleteUser(userId)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

// const getAllUser = async(req, res) => {
//     try {
//         const response = await UserService.getAllUser()
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

const getDetailOrder = async(req, res) => {
    try {
        const orderCode = req.params.orderCode
        if (!orderCode) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderCode is required'
            })
        }
        const response = await OrderProductService.getDetailOrder(orderCode)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// const refreshToken = async(req, res) => {
//     try {
//         const token = req.cookies.refresh_token
//         if (!token) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The token is required'
//             })
//         }
//         const response = await JwtService.refreshTokenJwtService(token)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

module.exports = {
  createOrderProduct,
  getDetailOrder
  // updateUser,
  // deleteUser,
  // getAllUser,
  // getDetailsUser,
  // refreshToken
};
