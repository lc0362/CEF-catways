const http = require('http');
const app = require('./api/app'); // Assure-toi que ce chemin est correct

const port = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
