const FeaturedSlideService = require("../services/FeaturedSlideService");

const createFeaturedSlider = async(req, res) => {
    try {
        const {
            name,
            image,
            logo,
            slug,
            status,
        } = req.body;
        if (!name || !slug) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await FeaturedSlideService.createFeaturedSlide(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updateFeaturedSlider = async(req, res) => {
    try {
        const FeaturedSlideId = req.params.id
        const data = req.body
        if (!FeaturedSlideId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The FeaturedSlideId is required'
            })
        }
        const response = await FeaturedSlideService.updateFeaturedSlide(FeaturedSlideId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteFeaturedSlider = async(req, res) => {
    try {
        const featuredSlideId = req.params.id
        if (!featuredSlideId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The featuredSlideId is required'
            })
        }
        const response = await FeaturedSlideService.deleteFeaturedSlide(featuredSlideId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllFeaturedSlider = async(req, res) => {
    try {
        const { limit, page } = req.query
        const response = await FeaturedSlideService.getAllFeaturedSlide(Number(limit) || 5, Number(page) || 0)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createFeaturedSlider,
    updateFeaturedSlider,
    deleteFeaturedSlider,
    getAllFeaturedSlider
};