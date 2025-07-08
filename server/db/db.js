const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'niterx';

const client = new MongoClient(uri);

async function mongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');

        const db = client.db(dbName);

        return db;

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = mongoDB;