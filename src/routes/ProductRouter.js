const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', ProductController.createProduct)
router.put('/update-product/:id', authMiddleware, ProductController.updateProduct)
router.delete('/delete-product/:id', authMiddleware, ProductController.deleteProduct)
router.get('/getAll', ProductController.getAllProduct)
router.get('/get-details/:slug-:id', ProductController.getDetailsProduct)
router.get('/get-product-by/:value', ProductController.getProductBy)
module.exports = router