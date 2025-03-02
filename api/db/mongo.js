const mongoose = require('mongoose');
require('dotenv').config({ path: '../../env/.env' });

const MONGO_URI = process.env.URL_MONGO;

if (!MONGO_URI) {
    process.exit(1);
}

const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'apinode'
};

// Initialisation de la connexion MongoDB
async function initClientDbConnection() {
    try {
        await mongoose.connect(MONGO_URI, clientOptions);
        console.log("✅ Connecté à MongoDB");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
        process.exit(1);
    }
}

module.exports = {
    mongoose, 
    initClientDbConnection
};
