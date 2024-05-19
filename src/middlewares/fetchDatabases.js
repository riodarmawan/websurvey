// Mengimpor koneksi database dari utilitas
const database = require('../config/connection');

// Middleware untuk mengambil daftar database
async function fetchDatabases(req, res, next) {
    try {
        const dbList = await database.listDatabases();
        res.locals.databases = dbList;
        next();
    } catch (error) {
        console.error('Error fetching databases:', error);
        res.status(500).send('Failed to fetch database list');
        next(error);
    }
}

module.exports = fetchDatabases;
