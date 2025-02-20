const Banner = require("../models/BannerModel")

const createBanner = (newBanner) => {
    return new Promise(async(resolve, reject) => {
        const {
            name,
            image,
            link,
            status,
            location
        } = newBanner
        try {
            const checkBanner = await Banner.findOne({
                name: name
            })
            if (checkBanner !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of Banner is already'
                })
            }
            const newBanner = await Banner.create({
                name,
                image,
                link,
                status,
                location
            })
            if (newBanner) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newBanner
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateBanner = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkBannerId = await Banner.findOne({
                _id: id
            })
            if (checkBannerId === null) {
                resolve({
                    status: 'OK',
                    message: 'The banner is not defined'
                })
            }
            const updatedBanner = await Banner.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedBanner
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteBanner = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkBanner = await Banner.findOne({
                _id: id
            })
            if (checkBanner === null) {
                resolve({
                    status: 'OK',
                    message: 'The Banner is not defined'
                })
            }
            await Banner.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Banner success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getBannerByLocation = (location) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkBannerLocation = await Banner.findOne({
                location: location
            })
            if (checkBannerLocation === null) {
                resolve({
                    status: 'OK',
                    message: 'The Banner is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Get Banner success',
                data: checkBannerLocation,
            })
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

const getAllBanner = (limit, page) => {
    return new Promise(async(resolve, reject) => {
        try {
            const totalBanner = await Banner.countDocuments()
            const allBanner = await Banner.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'Get all Banner success',
                data: allBanner,
                total: totalBanner,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalBanner / limit)
            })
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

module.exports = {
    createBanner,
    updateBanner,
    deleteBanner,
    getAllBanner,
    getBannerByLocation
}