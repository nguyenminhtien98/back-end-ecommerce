const CategoryService = require("../services/CategoryService");

const createCategory = async(req, res) => {
    try {
        const {
            name,
            slug,
            image,
            subMenu
        } = req.body;
        if (!name || !slug) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await CategoryService.createCategory(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updateCategory = async(req, res) => {
    try {
        const categoryId = req.params.id
        const data = req.body
        if (!categoryId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The categoryId is required'
            })
        }
        const response = await CategoryService.updateCategory(categoryId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCategory = async(req, res) => {
    try {
        const categoryId = req.params.id
        if (!categoryId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The categoryId is required'
            })
        }
        const response = await CategoryService.deleteCategory(categoryId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCategory = async(req, res) => {
    try {
        const { limit, page } = req.query
        const response = await CategoryService.getAllCategory(Number(limit) || 6, Number(page) || 0)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory
};