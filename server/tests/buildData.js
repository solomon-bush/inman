const Location = require('../src/models/Location');
const Category = require('../src/models/Category');
const Model = require('../src/models/Model');
const Manufacturer = require('../src/models/Manufacturer');
const User = require('../src/models/User');
const Asset = require('../src/models/Asset');
const StockItem = require('../src/models/StockItem');
const mongoose = require('mongoose')
const db = require('../src/db');

db.connect().then(async () => {
    await testLocations()
    await testCategory()
    await testManufacturer()
    await testModel()
    await testAsset()
    await testStockItem()
    await testUser()
})



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


const testStockItem = () => {
    return new Promise((resolve, reject) => {
        StockItem.find().then((results) => {
            results.forEach(stockItem => {
                stockItem.remove()
            })
        }).then(async () => {
            let model = await Model.find({ name: '5ft Green Ethernet' })
            let locations = await Location.find()
            let S1 = StockItem({
                identifiers: {
                    model: model[0]._id,
                    tags: ['Standard', 'Cat5', 'Insulated', 'Green']
                },
                locationQuantity: [
                    { location: locations[1]._id, quantity: 10 },
                    { location: locations[0]._id, quantity: 22 }
                ]
            })

            await S1.save()
        }).then(() => {
            StockItem.find().populate('identifiers.model').then((results) => {
                console.log(results[0].toJSON())
                resolve()
            })
        })
    })
}

const testUser = () => {
    return new Promise((resolve, reject) => {
        User.find().then((results) => {
            results.forEach(stockItem => {
                stockItem.remove()
            })
        }).then(async () => {
            let locations = await Location.find()
            let U1 = new User({
                gtid: '902135458',
                userName: 'mbush31',
                firstName: 'Solomon',
                lastName: 'Bush',
                email: 'm.solomon.bush@gmail.com',
                department: 'GTRI-CIPHER-IT',
                title: 'Research Technologist I',
                location: locations[0]._id,
            })
            await U1.save()
        }).then(() => {
            User.find().populate('location').then((results) => {
                console.log(results[0].toJSON())
                resolve()
            })
        })
    })
}