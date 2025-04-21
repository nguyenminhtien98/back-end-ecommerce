const UserRouter = require("./UserRouter")
const ProductRouter = require("./ProductRouter")
const CategoryRouter = require("./CategoryRouter")
const FeaturedRouter = require("./FeaturedRouter")
const BannerRouter = require("./BannerRouter")
const OrderRouter = require("./OrderRouter")
const ChatRouter = require('./ChatRouter')
const MessageRouter = require('./MessageRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/category', CategoryRouter)
    app.use('/api/featured', FeaturedRouter)
    app.use('/api/banner', BannerRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/chats', ChatRouter);  // Các route liên quan đến chat
    app.use('/api/messages', MessageRouter);  // Các route liên quan đến message
}

module.exports = routes