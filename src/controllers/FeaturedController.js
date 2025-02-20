const FeaturedService = require("../services/FeaturedService");

const createFeatured = async(req, res) => {
    try {
        const {
            name,
            image,
            logo,
            link,
            slide,
            status,
        } = req.body;
        if ( !name || !image ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await FeaturedService.createFeatured(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updateFeatured = async(req, res) => {
    try {
        const FeaturedSlideId = req.params.id
        const data = req.body
        if (!FeaturedSlideId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The FeaturedSlideId is required'
            })
        }
        const response = await FeaturedService.updateFeatured(FeaturedSlideId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteFeatured = async(req, res) => {
    try {
        const featuredSlideId = req.params.id
        if (!featuredSlideId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The featuredSlideId is required'
            })
        }
        const response = await FeaturedService.deleteFeatured(featuredSlideId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllFeatured = async(req, res) => {
    try {
        const { limit, page } = req.query
        const response = await FeaturedService.getAllFeatured(Number(limit) || 5, Number(page) || 0)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getFeaturedHome = async(req, res) => {
    try {
        const response = await FeaturedService.getFeaturedHome()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createFeatured,
    updateFeatured,
    deleteFeatured,
    getAllFeatured,
    getFeaturedHome
};