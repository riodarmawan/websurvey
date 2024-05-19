require('dotenv').config(); // Memuat variabel lingkungan dari file .env

module.exports = {
    express: {
        port: process.env.PORT || 3000 // Gunakan port dari variabel lingkungan atau gunakan 3000 sebagai default
    },
    session: {
        secret: process.env.SESSION_SECRET || 'secret', // Gunakan rahasia sesi dari variabel lingkungan atau gunakan 'secret' sebagai default
        saveUninitialized: true,
        resave: false
    },
    cors: {
        origin: 'http://localhost:3000', // Sesuaikan dengan URL asal yang Anda percayai
        optionsSuccessStatus: 200 // Untuk beberapa browser legacy yang tidak mendukung kode status 204
    },
    passport: {
        google: {
            clientID: process.env.GOOGLE_CLIENT_ID, // ID Klien dari variabel lingkungan
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Rahasia Klien dari variabel lingkungan
            callbackURL: "http://localhost:3000/auth/google/callback" // URL callback untuk OAuth
        }
    },
    database: {
        uri: process.env.DATABASE_URI // URI database dari variabel lingkungan
    },
    morgan: {
        mode: 'dev' // Mode logging Morgan
    }
};
