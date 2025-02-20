const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { resolve } = require('path')
const { rejects } = require('assert')
dotenv.config()

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '900s' })
    return access_token
}

const generalRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, rejects) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authemtication'
                    })
                }
                const access_token = await generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                })
            })
        } catch (e) {
            rejects(e)
        }
    })
}

module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}