const ProductService = require("../services/ProductService");

const createProduct = async(req, res) => {
    try {
        const {
            name,
            slug,
            image,
            clb,
            category,
            parent,
            parent_slug,
            price,
            productNew,
            sale,
            sold,
            countInstock,
            size,
            rating,
            trending,
            story,
            description_story,
            status,
            description
        } = req.body;
        if (!name || !slug || !image || !price || !countInstock || !size || !category || !parent || !parent_slug) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updateProduct = async(req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async(req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async(req, res) => {
    try {
        const { limit, page, filter } = req.query
        const response = await ProductService.getAllProduct(Number(limit), Number(page) || 0, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async(req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getProductBy = async(req, res) => {
    try {
        const value = req.params.value
        if (!value) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The value is required'
            })
        }
        const response = await ProductService.getProductBy(value)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getDetailsProduct,
    getProductBy
};