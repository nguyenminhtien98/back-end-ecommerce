const Featured = require("../models/FeaturedModel")

const createFeatured = (newFeatured) => {
    return new Promise(async(resolve, reject) => {
        const {
            name,
            image,
            logo,
            link,
            slide,
            status,
            code
        } = newFeatured
        try {
            const checkFeatured = await Featured.findOne({
                name: name
            })
            if (checkFeatured !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of Featured is already'
                })
            }
            const newFeatured = await Featured.create({
                name,
                image,
                logo,
                link,
                slide,
                status,
                code
            })
            if (newFeatured) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newFeatured
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateFeatured = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkFeatured = await Featured.findOne({
                _id: id
            })
            if (checkFeatured === null) {
                resolve({
                    status: 'OK',
                    message: 'The featured is not defined'
                })
            }
            const updatedFeatured = await Featured.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedFeatured
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteFeatured = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkFeatured = await Featured.findOne({
                _id: id
            })
            if (checkFeatured === null) {
                resolve({
                    status: 'OK',
                    message: 'The Featured is not defined'
                })
            }
            await Featured.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Featured success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllFeatured = (limit, page) => {
    return new Promise(async(resolve, reject) => {
        try {
            const totalFeatured = await Featured.countDocuments()
            const allFeatured = await Featured.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'Get all Featured success',
                data: allFeatured,
                total: totalFeatured,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalFeatured / limit)
            })
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

const getFeaturedHome = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const allFeaturedHome = await Featured.find({
                status: true
            });
            if (allFeaturedHome === null) {
                resolve({
                    status: 'OK',
                    message: 'The Featured is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allFeaturedHome
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createFeatured,
    updateFeatured,
    deleteFeatured,
    getAllFeatured,
    getFeaturedHome
}