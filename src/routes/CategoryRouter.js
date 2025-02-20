const express = require("express");
const router = express.Router()
const categoryController = require('../controllers/CategoryController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create', categoryController.createCategory)
router.put('/update-category/:id', categoryController.updateCategory)
router.delete('/delete-category/:id', authMiddleware, categoryController.deleteCategory)
router.get('/get-all', categoryController.getAllCategory)

module.exports = router