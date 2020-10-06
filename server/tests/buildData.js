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
            //Offices
            let L1 = new Location({
                _id: '5f7ab3980ff962313cbc3a31',
                state: 'GA',
                site: 'Atlanta',
                bldg: '430N',
                room: '210',
                isStorage: false
            })
            let L2 = new Location({
                _id: '5f7ab3980ff962313cbc3a32',
                state: 'GA',
                site: 'Atlanta',
                bldg: '430N',
                room: '209A',
                isStorage: false
            })
            let L3 = new Location({
                _id: '5f7ab3980ff962313cbc3a33',
                state: 'GA',
                site: 'Atlanta',
                bldg: 'CRB',
                room: '250',
                isStorage: false
            })
            //Storage Rooms
            let L4 = new Location({
                _id: '5f7ab3980ff962313cbc3a34',
                state: 'GA',
                site: 'Atlanta',
                bldg: 'WF',
                room: '943',
                isStorage: true
            })
            let L5 = new Location({
                _id: '5f7ab3980ff962313cbc3a35',
                state: 'GA',
                site: 'Atlanta',
                bldg: 'CRB',
                room: '244',
                isStorage: true
            })
            let L6 = new Location({
                _id: '5f7ab3980ff962313cbc3a36',
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
            let C1 = Category({ _id: '5f7ab3980ff962313cbc3a37', name: 'laptops' });
            let C2 = Category({ _id: '5f7ab3980ff962313cbc3a38', name: 'cables' })
            let C3 = Category({ _id: '5f7ab3980ff962313cbc3a39', name: 'monitors' })
            let C4 = Category({ _id: '5f7ab3980ff962313cbc3a3a', name: 'printers' })
            let C5 = Category({ _id: '5f7ab3980ff962313cbc3a3b', name: 'mice' })

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
            let M1 = Manufacturer({ _id: '5f7ab3980ff962313cbc3a3c', name: 'apple' });
            let M2 = Manufacturer({ _id: '5f7ab3980ff962313cbc3a3d', name: 'logitech' })
            let M3 = Manufacturer({ _id: '5f7ab3980ff962313cbc3a3e', name: 'microsoft' });
            let M4 = Manufacturer({ _id: '5f7ab3980ff962313cbc3a3f', name: 'samsung' })
            let M5 = Manufacturer({ _id: '5f7ab3980ff962313cbc3a30', name: 'hp' });
            let M6 = Manufacturer({ _id: '5f7ab3980ff962313cbc3a31', name: 'dell' });
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
                _id: '5f7ab3980ff962313cbc3a42',
                name: 'A1170',
                isTracked: true,
                description: 'Macbook Air',
                manufacturer: man[0]._id,
                category: cat[0]._id
            })
            let M2 = Model({
                _id: '5f7ab3980ff962313cbc3a43',
                name: 'A2230',
                isTracked: true,
                manufacturer: man[0]._id,
                description: 'MacBook Pro',
                category: cat[0]._id
            })
            let M3 = Model({
                _id: '5f7ab3980ff962313cbc3a44',
                name: 'U245',
                isTracked: true,
                description: '32in LCD Monitor',
                manufacturer: man[5]._id,
                category: cat[2]._id
            })
            let M4 = Model({
                _id: '5f7ab3980ff962313cbc3a45',
                name: '5ft Green Ethernet',
                isTracked: false,
                manufacturer: man[1]._id,
                category: cat[1]._id
            })
            let M5 = Model({
                _id: '5f7ab3980ff962313cbc3a46',
                name: 'MX Master 2',
                isTracked: false,
                manufacturer: man[1]._id,
                category: cat[4]._id
            })
            let M6 = Model({
                _id: '5f7ab3980ff962313cbc3a47',
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
                _id: '5f7ab3980ff962313cbc3a48',
                model: models[0]._id,
                sn: '1234',
                po: 'test',
                ticket: 'asdf',
                tags: ['macbook', 'air', '2014'],
                origin: locations[3]._id
            })
            let A2 = Asset({
                _id: '5f7ab3980ff962313cbc3a49',
                model: models[0]._id,
                sn: '1223',
                po: 'asdfaa',
                ticket: 'asdf1213',
                tags: ['macbook', 'air', '2014'],
                origin: locations[3]._id
            })
            let A3 = Asset({
                _id: '5f7ab3980ff962313cbc3a4a',
                model: models[1]._id,
                sn: '0012004',
                tags: ['macbook', 'pro', '2016'],
                origin: locations[3]._id
            })
            let A4 = Asset({
                _id: '5f7ab3980ff962313cbc3a4b',
                model: models[1]._id,
                sn: '000123',
                tags: ['macbook', 'pro', '2016'],
                origin: locations[4]._id
            })
            let A5 = Asset({
                _id: '5f7ab3980ff962313cbc3a4c',
                model: models[1]._id,
                sn: '00120076',
                tags: ['macbook', 'pro', '2016'],
                origin: locations[5]._id
            })

            let A6 = Asset({
                _id: '5f7ab3980ff962313cbc3a4d',
                model: models[2]._id,
                sn: 'A001556',
                tags: ['lcd', 'monitor'],
                origin: locations[3]._id
            })
            let A7 = Asset({
                _id: '5f7ab3980ff962313cbc3a4e',
                model: models[2]._id,
                sn: 'A0015163',
                tags: ['lcd', 'monitor'],
                origin: locations[3]._id
            })
            let A8 = Asset({
                _id: '5f7ab3980ff962313cbc3a4f',
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
                _id: '5f7bbc6219b93435c0a3bd57',
                model: models[3]._id,
                tags: ['Standard', 'Cat5', 'Insulated', 'Green'],
                locationQuantity: [
                    { location: locations[3]._id, quantity: 10 },
                    { location: locations[4]._id, quantity: 44 },
                    { location: locations[5]._id, quantity: 18 }
                ]
            })
            let S2 = StockItem({

                _id: "5f7bbc6219b93435c0a3bd58",
                model: models[4]._id,
                tags: ['Laser', 'Ergonomic', 'Gesture', 'Windows', 'Mac'],
                locationQuantity: [
                    { location: locations[3]._id, quantity: 10 },
                    { location: locations[4]._id, quantity: 44 },
                    { location: locations[5]._id, quantity: 0 }
                ]
            })
            let S3 = StockItem({
                _id: "5f7bbc6219b93435c0a3bd59",
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
                _id: '5f79f9f7579f5938683f1f9a',
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
                _id: '5f79f9f7579f5938683f1f9b',
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
                _id: '5f79f9f7579f5938683f1f9c',
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