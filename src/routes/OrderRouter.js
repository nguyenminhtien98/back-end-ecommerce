const express = require("express");
const router = express.Router()
const OrderProductController = require('../controllers/OrderProductController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', OrderProductController.createOrderProduct)
// router.put('/update-product/:id', authMiddleware, ProductController.updateProduct)
// router.delete('/delete-product/:id', authMiddleware, ProductController.deleteProduct)
// router.get('/getAll', ProductController.getAllProduct)
// router.get('/get-details/:slug-:id', ProductController.getDetailsProduct)
router.get('/get-detail/:orderCode', OrderProductController.getDetailOrder)
module.exports = router