const assetRoutes = require('./basic/asset')
module.exports.set = (app) => {
    assetRoutes.set(app)
}