const assert = require('assert')

module.exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection)
    // W2-node-mongodb-driver-2
    // coll.insertOne(document)
    //     .then(result => {
    //         console.log('Inserted document with insertedId: ' + result.insertedId)
    //         callback(result)
    //     },
    //     err => assert.equal(err, null))
    //     .catch(error => console.log(error.message))

    return coll.insertOne(document)
}

module.exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection)
    // W2-node-mongodb-driver-2
    // coll.find({}).toArray()
    //     .then(documents => {
    //         callback(documents)
    //     },
    //     err => assert.equal(err, null))
    //     .catch(error => console.log(error.message))

    return coll.find({}).toArray()
}

module.exports.removeDocuments = (db, document, collection, callback) => {
    const coll = db.collection(collection)
    // W2-node-mongodb-driver-2
    // coll.deleteOne(document)
    //     .then(result => {
    //         console.log('Removed document: ' + document)
    //         callback(result)
    //     },
    //     err => assert.equal(err, null))
    //     .catch(error => console.log(error.message))

    return coll.deleteOne(document)
}

module.exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection)
    // W2-node-mongodb-driver-2
    // coll.updateOne(document, { $set: update })
    //     .then(result => {
    //         console.log('Updated the document with: ' + JSON.stringify(update))
    //         callback(result)
    //     },
    //     err => assert.equal(err, null))
    //     .catch(error => console.log(error.message))

    return coll.updateOne(document, { $set: update })
}