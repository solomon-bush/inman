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
    // await testUser()
})



const testLocations = () => {
    return new Promise(async (resolve, reject) => {
        //wipe locations
        Location.find().then((results) => {
            results.forEach(location => {
                location.remove()
            })
        }).then(async () => {
            //Offices
            let L1 = new Location({
                state: 'GA',
                site: 'Atlanta',
                bldg: '430N',
                room: '210',
                isStorage: false
            })
            let L2 = new Location({
                state: 'GA',
                site: 'Atlanta',
                bldg: '430N',
                room: '209A',
                isStorage: false
            })
            let L3 = new Location({
                state: 'GA',
                site: 'Atlanta',
                bldg: 'CRB',
                room: '250',
                isStorage: false
            })
            //Storage Rooms
            let L4 = new Location({
                state: 'GA',
                site: 'Atlanta',
                bldg: 'WF',
                room: '943',
                isStorage: true
            })
            let L5 = new Location({
                state: 'GA',
                site: 'Atlanta',
                bldg: 'CRB',
                room: '244',
                isStorage: true
            })
            let L6 = new Location({
                state: 'CA',
                site: 'San Diego',
                bldg: 'SDFO',
                room: 'ITLab',
                isStorage: true
            })


            await L1.save()
            await L2.save()
            await L3.save()
            await L4.save()
            await L5.save()
            await L6.save()
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
            let C3 = Category({ name: 'monitors' })
            let C4 = Category({ name: 'printers' })
            let C5 = Category({ name: 'mice' })

            await C1.save()
            await C2.save()
            await C3.save()
            await C4.save()
            await C5.save()

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
            let M3 = Manufacturer({ name: 'microsoft' });
            let M4 = Manufacturer({ name: 'samsung' })
            let M5 = Manufacturer({ name: 'hp' });
            let M6 = Manufacturer({ name: 'dell' });
            await M1.save()
            await M2.save()
            await M3.save()
            await M4.save()
            await M5.save()
            await M6.save()
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
                name: 'A1170',
                isTracked: true,
                description: 'Macbook Air',
                manufacturer: man[0]._id,
                category: cat[0]._id
            })
            let M2 = Model({
                name: 'A2230',
                isTracked: true,
                manufacturer: man[0]._id,
                description: 'MacBook Pro',
                category: cat[0]._id
            })
            let M3 = Model({
                name: 'U245',
                isTracked: true,
                description: '32in LCD Monitor',
                manufacturer: man[5]._id,
                category: cat[2]._id
            })
            let M4 = Model({
                name: '5ft Green Ethernet',
                isTracked: false,
                manufacturer: man[1]._id,
                category: cat[1]._id
            })
            let M5 = Model({
                name: 'MX Master 2',
                isTracked: false,
                manufacturer: man[1]._id,
                category: cat[4]._id
            })
            let M6 = Model({
                name: 'M315',
                isTracked: false,
                manufacturer: man[1]._id,
                category: cat[4]._id
            })



            await M1.save()
            await M2.save()
            await M3.save()
            await M4.save()
            await M5.save()
            await M6.save()

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
            let models = await Model.find()
            let locations = await Location.find()
            let A1 = Asset({
                model: models[0]._id,
                sn: '1234',
                po: 'test',
                ticket: 'asdf',
                tags: ['macbook', 'air', '2014'],
                origin: locations[3]._id
            })
            let A2 = Asset({
                model: models[0]._id,
                sn: '1223',
                po: 'asdfaa',
                ticket: 'asdf1213',
                tags: ['macbook', 'air', '2014'],
                origin: locations[3]._id
            })
            let A3 = Asset({
                model: models[1]._id,
                sn: '0012004',
                tags: ['macbook', 'pro', '2016'],
                origin: locations[3]._id
            })
            let A4 = Asset({
                model: models[1]._id,
                sn: '000123',
                tags: ['macbook', 'pro', '2016'],
                origin: locations[4]._id
            })
            let A5 = Asset({
                model: models[1]._id,
                sn: '00120076',
                tags: ['macbook', 'pro', '2016'],
                origin: locations[5]._id
            })

            let A6 = Asset({
                model: models[2]._id,
                sn: 'A001556',
                tags: ['lcd', 'monitor'],
                origin: locations[3]._id
            })
            let A7 = Asset({
                model: models[2]._id,
                sn: 'A0015163',
                tags: ['lcd', 'monitor'],
                origin: locations[3]._id
            })
            let A8 = Asset({
                model: models[2]._id,
                sn: 'A001522',
                tags: ['lcd', 'monitor'],
                origin: locations[3]._id
            })

            await A1.save()
            await A2.save()
            await A3.save()
            await A4.save()
            await A5.save()
            await A6.save()
            await A7.save()
            await A8.save()
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
            let models = await Model.find()
            let locations = await Location.find()
            let S1 = StockItem({
                model: models[3]._id,
                tags: ['Standard', 'Cat5', 'Insulated', 'Green'],
                locationQuantity: [
                    { location: locations[3]._id, quantity: 10 },
                    { location: locations[4]._id, quantity: 44 },
                    { location: locations[5]._id, quantity: 18 }
                ]
            })
            let S2 = StockItem({
                model: models[4]._id,
                tags: ['Laser', 'Ergonomic', 'Gesture', 'Windows', 'Mac'],
                locationQuantity: [
                    { location: locations[3]._id, quantity: 10 },
                    { location: locations[4]._id, quantity: 44 },
                    { location: locations[5]._id, quantity: 0 }
                ]
            })
            let S3 = StockItem({
                model: models[5]._id,
                tags: ['Standard', 'Windows'],
                locationQuantity: [
                    { location: locations[3]._id, quantity: 8 },
                    { location: locations[4]._id, quantity: 13 },
                    { location: locations[5]._id, quantity: 12 }
                ]
            })

            await S1.save()
            await S2.save()
            await S3.save()

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
                gtid: '902704894',
                userName: 'mbush31',
                firstName: 'Solomon',
                lastName: 'Bush',
                email: 'm.solomon.bush@gmail.com',
                department: 'GTRI-CIPHER-IT-OPS-ATL',
                phone: '404-407-7001',
                title: 'Research Technologist I',
                location: locations[0]._id,
            })
            let U2 = new User({
                gtid: '903255330',
                userName: 'achew7',
                firstName: 'Andrew',
                lastName: 'Chew',
                email: 'achew7@ctisl.gtri.org',
                department: 'GTRI-CIPHER-IT-OPS-ATL',
                title: 'Research Scientist I',
                phone: '404-407-7211',
                location: locations[1]._id,
            })
            let U3 = new User({
                gtid: '903259276',
                userName: 'jwilson369',
                firstName: 'Jarred',
                lastName: 'Wilson',
                email: 'jwilson369@ctisl.gtri.org',
                department: 'GTRI-CIPHER-IT-OPS-ATL',
                title: 'Contractor',
                location: locations[2]._id,
            })
            await U1.save()
            await U2.save()
            await U3.save()
        }).then(() => {
            User.find().populate('location').then((results) => {
                console.log(results[0].toJSON())
                resolve()
            })
        })
    })
}