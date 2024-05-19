const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require('mongoose');

const database = {
    url: function (databaseName) {
        return `mongodb://127.0.0.1:27017/${databaseName}`;
    },
    client: null,
    async connectToDatabase(databaseName) {
        this.client = new MongoClient(this.url(databaseName));
        try {
            await this.client.connect();
            return this.client.db(databaseName);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async closeDatabaseConnection() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('Connection closed');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async insertSurveyData(databaseName, collectionName, data) {
        try {
            const db = await this.connectToDatabase(databaseName);
            const collection = db.collection(collectionName);
            const result = await collection.insertOne(data);
            console.log("Survey data inserted!");
            await this.closeDatabaseConnection();
            return result;
        } catch (err) {
            console.error('Failed to insert survey data:', err);
            await this.closeDatabaseConnection();
            throw err;
        }
    },
    async listDatabases() {
        let client;
        try {
            client = new MongoClient(this.url(""));
            await client.connect();
            const databasesList = await client.db().admin().listDatabases();
            return databasesList.databases.map(db => db.name);
        } catch (err) {
            console.error("Failed to retrieve database list:", err);
            throw err;
        } finally {
            if (client) {
                await client.close();
            }
        }
    },
    async getDocumentData(databaseName, collectionName, documentId) {
        let client;
        try {
            client = new MongoClient(this.url(databaseName));
            await client.connect();
            const db = client.db(databaseName);
            const collection = db.collection(collectionName);
            const document = await collection.findOne({ _id: new ObjectId(documentId) });
            console.log("Data retrieved!");

            // Mengonversi objek menjadi array
            if (document && typeof document === 'object') {
                return Object.entries(document); // Mengembalikan array dari entri objek
            } else {
                throw new Error('Document is not an object');
            }
        } catch (err) {
            console.error('Failed to retrieve data from collection:', err);
            throw err;
        } finally {
            if (client) {
                await client.close();
                console.log('Connection closed');
            }
        }
    },
    async listDocuments(databaseName, collectionName) {
        try {
            const db = await this.connectToDatabase(databaseName);
            const collection = db.collection(collectionName);
            const documents = await collection.find().toArray();
            await this.closeDatabaseConnection();
            return documents;
        } catch (err) {
            console.error('Failed to list documents:', err);
            await this.closeDatabaseConnection();
            throw err;
        }
    },
    async findDocumentById(databaseName, collectionName, documentId) {
        try {
            const db = await this.connectToDatabase(databaseName);
            const collection = db.collection(collectionName);
            const document = await collection.findOne({ _id: new ObjectId(documentId) });
            await this.closeDatabaseConnection();
            return document;
        } catch (err) {
            console.error('Failed to find document:', err);
            await this.closeDatabaseConnection();
            throw err;
        }
    }
    ,
    connection: null,
    async mongooseConnect() {
        if (this.connection) {
            return this.connection;
        }

        try {
            const conn = await mongoose.connect(`mongodb://127.0.0.1:27017/user`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            this.connection = conn;
            return conn;
        } catch (err) {
            console.error('Failed to connect to MongoDB:', err);
            throw err;
        }
    },
    async mongooseDisconnect() {
        if (this.connection) {
            try {
                await mongoose.disconnect();
                console.log('MongoDB disconnected');
                this.connection = null;
            } catch (err) {
                console.error('Failed to disconnect MongoDB:', err);
                throw err;
            }
        }
    }
}

module.exports = database;
