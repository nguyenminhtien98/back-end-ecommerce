const UserRouter = require("./UserRouter")
const ProductRouter = require("./ProductRouter")
const CategoryRouter = require("./CategoryRouter")
const FeaturedRouter = require("./FeaturedRouter")
const BannerRouter = require("./BannerRouter")
const OrderRouter = require("./OrderRouter")

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/category', CategoryRouter)
    app.use('/api/featured', FeaturedRouter)
    app.use('/api/banner', BannerRouter)
    app.use('/api/order', OrderRouter)
}

module.exports = routes