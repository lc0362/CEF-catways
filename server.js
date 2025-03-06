require('dotenv').config({ path: './env/.env' });

console.log("📢 Chargement des variables d'environnement...");
console.log("DB_URI:", process.env.DB_URI ? "✅ Définie" : "❌ Non définie");
console.log("PORT:", process.env.PORT || "8080 (par défaut)");
console.log("SECRET_KEY:", process.env.SECRET_KEY ? "✅ Définie" : "❌ Non définie");

// Vérifier si toutes les variables sont bien définies
if (!process.env.DB_URI || !process.env.SECRET_KEY || !process.env.PORT) {
    console.error("🚨 Erreur: Une ou plusieurs variables d'environnement sont manquantes.");
    process.exit(1);
}

const http = require('http');
const app = require('./api/app');
const { initClientDbConnection } = require('./api/db/mongo');

// Capture des erreurs non gérées pour éviter les crashs silencieux
process.on('uncaughtException', (err) => {
    console.error("🔥 Une erreur non gérée a été détectée :", err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("⚠️ Rejection non gérée :", reason);
    process.exit(1);
});

console.log("🔄 Tentative de connexion à MongoDB...");

// Initialisation de MongoDB avec logs d'erreur détaillés
initClientDbConnection()
    .then(() => {
        console.log("✅ Connexion MongoDB réussie.");

        const port = process.env.PORT || 8080;
        const server = http.createServer(app);

        server.listen(port, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
        });

        // Vérification que le serveur tourne toujours après 10s
        setTimeout(() => {
            console.log("⏳ Le serveur tourne toujours après 10s !");
        }, 10000);
    })
    .catch(err => {
        console.error("❌ Erreur lors de la connexion à MongoDB :", err);
        process.exit(1);
    });
