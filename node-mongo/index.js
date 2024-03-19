const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const dbOperations = require('./operations')

const url = 'mongodb://localhost:27017/'
const dbName = 'confusion'

MongoClient.connect(url)
    .then(client => {
        console.log('Connected correctly to server')

        const db = client.db(dbName)
        // W2-node-mongodb-driver-1
        // const collection = db.collection('dishes')

        // collection.insertOne({"name": "Uthapizza", "description": "test"})
        //     .then(result => {
        //         console.log('After result:\n' + result.acknowledged)

        //         collection.find({}).toArray()
        //             .then(documents => {
        //                 console.log('Found ' + documents.length + ' documents:\n' +
        //                     documents.map(doc => JSON.stringify(doc)).join('\n'))

        //                 db.dropCollection('dishes')
        //                     .then(() => {
        //                         client.close()
        //                     },
        //                     err => assert.equal(err, null))
        //             },
        //             err => assert.equal(err, null))
        //     },
        //     err => assert.equal(err, null))

        // W2-node-mongodb-driver-2
        // dbOperations.insertDocument(db, {name: 'Vadonut', description: 'Test'}, 'dishes', (result) => {
        //     console.log('Insert document:\n', result.acknowledged)

        //     dbOperations.findDocuments(db, 'dishes', (documents) => {
        //         console.log('Found documents:\n', documents)

        //         dbOperations.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated Test'}, 'dishes', (result) => {
        //             console.log('Updated document: ' + result.upsertedId + '\nUpdate count: ' + result.modifiedCount)

        //             dbOperations.findDocuments(db, 'dishes', (documents) => {
        //                 console.log('Found documents:\n', documents)

        //                 db.dropCollection('dishes')
        //                     .then(result => {
        //                         console.log('Dropped collection: ' + result)

        //                         client.close()
        //                     })
        //             })
        //         })
        //     })
        // })

        dbOperations.insertDocument(db, {name: 'Vadonut', description: 'Test'}, 'dishes')
            .then((result) => {
                console.log('Insert document:\n', result.acknowledged)

                return dbOperations.findDocuments(db, 'dishes')
            })
            .then((documents) => {
                console.log('Found documents:\n', documents)

                return dbOperations.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated Test'}, 'dishes')
            })
            .then((result) => {
                console.log('Updated document: ' + result.upsertedId + '\nUpdate count: ' + result.modifiedCount)

                return dbOperations.findDocuments(db, 'dishes')
            })
            .then((documents) => {
                console.log('Found documents:\n', documents)

                return db.dropCollection('dishes')
            })
            .then(result => {
                console.log('Dropped collection: ' + result)

                client.close()
            })
            .catch(error => console.log(error))
    })
    .catch(error => console.log(error))

// implementation according to mongodb driver 3.x
// MongoClient.connect(url, (err, client) => {
//     assert.equal(err, null)

//     console.log('Connected correctly to server')

//     const db = client.db(dbName)
//     const collection = db.collection('dishes')

//     collection.insertOne({"name": "Uthapizza", "description": "test"}, (err, result) => {
//         assert.equal(err, null)

//         console.log('After result:\n' + result.ops)

//         collection.find({}).toArray((err, documents) => {
//             assert.equal(err, null)

//             console.log('Found:\n' + documents)

//             db.dropCollection('dishes', (err, result) => {
//                 assert.equal(err, null)

//                 client.close()
//             })
//         })
//     })
// })