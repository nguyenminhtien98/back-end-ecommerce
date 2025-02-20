const Category = require("../models/CategoryModel")
const bcrypt = require("bcrypt")

const createCategory = (newCategory) => {
    return new Promise(async(resolve, reject) => {
        const {
            name,
            slug,
            image,
            subMenu
        } = newCategory
        try {
            const checkCategory = await Category.findOne({
                name: name
            })
            if (checkCategory !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of Category is already'
                })
            }
            const newCategory = await Category.create({
                name,
                slug,
                image,
                subMenu
            })
            if (newCategory) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newCategory
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateCategory = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({
                _id: id
            })
            if (checkCategory === null) {
                resolve({
                    status: 'OK',
                    message: 'The category is not defined'
                })
            }
            const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedCategory
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteCategory = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({
                _id: id
            })
            if (checkCategory === null) {
                resolve({
                    status: 'OK',
                    message: 'The Category is not defined'
                })
            }
            await Category.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Category success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCategory = (limit, page) => {
    return new Promise(async(resolve, reject) => {
        try {
            const totalCategory = await Category.countDocuments()
            const allCategory = await Category.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'Get all Category success',
                data: allCategory,
                total: totalCategory,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalCategory / limit)
            })
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory
}