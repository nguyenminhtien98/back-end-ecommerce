const BannerService = require("../services/BannerService");

const createBanner = async(req, res) => {
    try {
        const {
            name,
            image,
            link,
            status,
            location,
        } = req.body;
        if (!name || !link) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await BannerService.createBanner(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getBannerByLocation = async(req, res) => {
    try {
        const BannerLocation = req.params.location
        const data = req.body
        if (!BannerLocation) {
            return res.status(200).json({
                status: 'ERR',
            })
        }
        const response = await BannerService.getBannerByLocation(BannerLocation, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateBanner = async(req, res) => {
    try {
        const BannerId = req.params.id
        const data = req.body
        if (!BannerId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The BannerId is required'
            })
        }
        const response = await BannerService.updateBanner(BannerId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteBanner = async(req, res) => {
    try {
        const bannerId = req.params.id
        if (!bannerId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The bannerId is required'
            })
        }
        const response = await BannerService.deleteBanner(bannerId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBanner = async(req, res) => {
    try {
        const { limit, page } = req.query
        const response = await BannerService.getAllBanner(Number(limit) || 5, Number(page) || 0)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createBanner,
    updateBanner,
    deleteBanner,
    getAllBanner,
    getBannerByLocation
};