require('./api/db/mongo').initClientDbConnection();

const http = require('http');
const app = require('./api/app');

const port = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
