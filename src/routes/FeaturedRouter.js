const express = require("express");
const router = express.Router()
const FeaturedController = require('../controllers/FeaturedController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', FeaturedController.createFeatured)
router.put('/update-featured/:id', FeaturedController.updateFeatured)
router.delete('/delete-featured/:id', authMiddleware, FeaturedController.deleteFeatured)
router.get('/get-all', FeaturedController.getAllFeatured)
router.get('/get-featured-home', FeaturedController.getFeaturedHome)

module.exports = router