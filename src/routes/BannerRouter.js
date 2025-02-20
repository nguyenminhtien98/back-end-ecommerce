const express = require("express");
const router = express.Router()
const bannerController = require('../controllers/BannerController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', bannerController.createBanner)
router.put('/update-banner/:id', bannerController.updateBanner)
router.delete('/delete-banner/:id', authMiddleware, bannerController.deleteBanner)
router.get('/get-banner-by-location/:location', bannerController.getBannerByLocation)
router.get('/get-all', bannerController.getAllBanner)

module.exports = router