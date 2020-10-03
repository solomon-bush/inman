//DEPENDENCIES
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

//LOCAL
const db = require('./src/db');


const app = express()

db.connect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`INMAN Server running at http://localhost:${process.env.PORT}`)
        test()
    })
}).catch(err => { throw new Error(err) })


const Location = require('./src/models/location');
const Category = require('./src/models/category');
const Model = require('./src/models/model');
const Manufacturer = require('./src/models/manufacturer');
const User = require('./src/models/user');
const Asset = require('./src/models/asset');
const StockItem = require('./src/models/stockItem');
const category = require('./src/models/category');
const manufacturer = require('./src/models/manufacturer');
const asset = require('./src/models/asset');


const test = async () => {
    await testLocations()
    await testCategory()
    await testManufacturer()
    await testModel()
    await testAsset()
}

const testLocations = () => {
    return new Promise(async (resolve, reject) => {
        //wipe locations
        Location.find().then((results) => {
            results.forEach(location => {
                location.remove()
            })
        }).then(async () => {
            let L1 = new Location({
                state: 'Georgia',
                site: 'Atlanta',
                bldg: '430N',
                room: '210',
                isStorage: false
            })
            let L2 = new Location({
                state: 'Georgia',
                site: 'Atlanta',
                bldg: 'CRB',
                room: '244',
                isStorage: true
            })

            await L1.save()
            await L2.save()
        }).then(() => {
            Location.find().then(results => {
                console.log(results)
                resolve()
            })
        })



    })
}
const testCategory = () => {
    return new Promise((resolve, reject) => {
        Category.find().then((results) => {
            results.forEach(category => {
                category.remove()
            })
        }).then(async () => {
            let C1 = Category({ name: 'laptops' });
            let C2 = Category({ name: 'cables' })
            await C1.save()
            await C2.save()
        }).then(() => {
            Category.find().then((results) => {
                console.log(results)
                resolve()
            })
        })
    })

}
const testManufacturer = () => {
    return new Promise((resolve, reject) => {
        Manufacturer.find().then((results) => {
            results.forEach(manufacturer => {
                manufacturer.remove()
            })
        }).then(async () => {
            let M1 = Manufacturer({ name: 'apple' });
            let M2 = Manufacturer({ name: 'logitech' })
            await M1.save()
            await M2.save()
        }).then(() => {
            Manufacturer.find().then((results) => {
                console.log(results)
                resolve()
            })
        })
    })
}
const testModel = () => {
    return new Promise((resolve, reject) => {
        Model.find().then((results) => {
            results.forEach(model => {
                model.remove()
            })
        }).then(async () => {
            let man = await Manufacturer.find()
            let cat = await Category.find()
            console.log(man)
            let M1 = Model({
                name: 'A1170', isTracked: false,
                manufacturer: man[0]._id,
                category: cat[0]._id
            })
            let M2 = Model({
                name: '5ft Green Ethernet', isTracked: false,
                manufacturer: man[1]._id,
                category: cat[1]._id
            })
            await M1.save()
            await M2.save()
        }).then(() => {
            Model.find().populate(['manufacturer', 'category']).then((results) => {
                console.log(results)
                resolve()
            })
        })
    })

}

const testAsset = () => {
    return new Promise((resolve, reject) => {
        Asset.find().then((results) => {
            results.forEach(asset => {
                asset.remove()
            })
        }).then(async () => {
            let model = await Model.find({ name: 'A1170' })
            let A1 = Asset({
                identifiers: {
                    model: model[0]._id,
                    sn: '1234',
                    po: 'test',
                    ticket: 'asdf',
                    tags: ['test', 'macbook', 'air', '2014']
                }
            })
            await A1.save()
        }).then(() => {
            Asset.find().populate('identifiers.model').then((results) => {

                console.log(results[0].toJSON())
                resolve()
            })
        })
    })

}




