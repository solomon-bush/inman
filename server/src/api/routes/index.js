const assetRoutes = require('./basic/asset')
const categoryRoutes = require('./basic/category')
const locationRoutes = require('./basic/location')
const manufacturerRoutes = require('./basic/manufacturer')
const modelRoutes = require('./basic/model')
const stockItemRoutes = require('./basic/stockitem')
const userRoutes = require('./basic/user')

module.exports.set = (app) => {
    assetRoutes.set(app)
    categoryRoutes.set(app)
    locationRoutes.set(app)
    manufacturerRoutes.set(app)
    modelRoutes.set(app)
    stockItemRoutes.set(app)
    userRoutes.set(app)
}