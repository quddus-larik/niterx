const mongoDB = require('../db/db');

async function phones() {
    const db = await mongoDB();

    const phonesCollection = db.collection('phones');

    return phonesCollection; // You might want to return the collection or data from it
}

module.exports = phones;