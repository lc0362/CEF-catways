// Charger les variables d'environnement si elles ne sont pas définies
if (!process.env.DB_URI) {
    require('dotenv').config({ path: './env/.env' });
}

const http = require('http');
const app = require('./api/app');
const { initClientDbConnection } = require('./api/db/mongo');

// Vérification des variables d'environnement
console.log("Chargement des variables d'environnement...");
console.log("DB_URI:", process.env.DB_URI ? "Définie" : "Non définie");
console.log("PORT:", process.env.PORT);
console.log("SECRET_KEY:", process.env.SECRET_KEY ? "Définie" : "Non définie");

// Vérifier si toutes les variables requises sont bien définies
if (!process.env.DB_URI || !process.env.SECRET_KEY || !process.env.PORT) {
    console.error("Erreur: Une ou plusieurs variables d'environnement sont manquantes.");
    process.exit(1);
}

// Tentative de connexion à MongoDB
console.log("Tentative de connexion à MongoDB...");
initClientDbConnection()
    .then(() => {
        console.log("Connexion MongoDB réussie.");

        const port = process.env.PORT || 8080;
        const server = http.createServer(app);

        server.listen(port, () => {
            console.log(`Serveur démarré sur http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("Erreur lors de la connexion à MongoDB :", err);
        process.exit(1);
    });
