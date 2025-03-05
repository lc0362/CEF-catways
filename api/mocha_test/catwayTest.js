const assert = require("assert");
const http = require("http");

const BASE_URL = "http://localhost:8080";
let authToken = ""; // Stocke le token JWT
let testCatwayId = ""; // Stocke l'ID du catway pour les tests

// Récupérer un token d'authentification avant les tests avec le compte utilisateur Capitaine
before(function (done) {
    const postData = JSON.stringify({
        email: "capitaine@portrussell.com",
        password: "passwordPW"
    });

    const options = {
        hostname: "localhost",
        port: 8080,
        path: "/auth/login",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
        },
    };

    console.log("🔍 Tentative de connexion avec l'utilisateur Capitaine...");

    const req = http.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
            console.log("🔹 Réponse brute du serveur :", body);
            try {
                const response = JSON.parse(body);
                if (response.token) {
                    authToken = response.token;
                    console.log("🟢 Token JWT récupéré :", authToken);
                } else {
                    console.error("❌ Alerte : Le token JWT n'a pas été retourné !");
                }
                done();
            } catch (error) {
                console.error("❌ Erreur de parsing JSON :", error.message);
                done(error);
            }
        });
    });

    req.on("error", (err) => {
        console.error("❌ Erreur de connexion à l'API :", err.message);
        done(err);
    });

    req.write(postData);
    req.end();
});

describe("🛠️ Tests API Catways (avec authentification)", function () {
    // POST /catways - Ajouter un catway
    it("✅ Ajouter un catway", function (done) {
        const postData = JSON.stringify({
            catwayNumber: 99,
            catwayType: "long",
            catwayState: "Libre",
        });

        const options = {
            hostname: "localhost",
            port: 8080,
            path: "/catways/add",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
                "Content-Length": Buffer.byteLength(postData),
            },
        };

        const req = http.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                console.log("🔹 Réponse brute du serveur (POST /catways/add) :", body);

                try {
                    const response = JSON.parse(body);
                    testCatwayId = response._id;
                    console.log("🟢 ID du catway créé :", testCatwayId);
                    
                    assert.ok(testCatwayId, "❌ ID du catway non récupéré !");
                    done();
                } catch (error) {
                    console.error("❌ Erreur de parsing JSON :", error.message);
                    done(error);
                }
            });
        });

        req.on("error", (err) => done(err));
        req.write(postData);
        req.end();
    });

    // GET /catways - Récupérer tous les catways
    it("✅ Récupérer la liste des catways", function (done) {
        const options = {
            hostname: "localhost",
            port: 8080,
            path: "/catways",
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
        };
        http.get(options, (res) => {
            assert.strictEqual(res.statusCode, 200);
            done();
        }).on("error", (err) => done(err));
    });

    // GET /catways/:id - Récupérer un catway par ID
    it("✅ Récupérer un catway par ID", function (done) {
        if (!testCatwayId) return done(new Error("❌ Erreur : ID du catway non défini"));

        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/${testCatwayId}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        };

        http.get(options, (res) => {
            assert.strictEqual(res.statusCode, 200);
            done();
        }).on("error", (err) => {
            done(err);
        });
    });

    // PATCH /catways/:id - Modifier un catway
    it("✅ Modifier un catway", function (done) {
        if (!testCatwayId) return done(new Error("❌ Erreur : ID du catway non défini"));

        const putData = JSON.stringify({ catwayState: "Réservé" });

        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/${testCatwayId}`,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
                "Content-Length": Buffer.byteLength(putData),
            },
        };

        const req = http.request(options, (res) => {
            assert.strictEqual(res.statusCode, 200);
            done();
        });

        req.on("error", (err) => done(err));
        req.write(putData);
        req.end();
    });

    // DELETE /catways/:id - Supprimer un catway
    it("✅ Supprimer un catway", function (done) {
        if (!testCatwayId) return done(new Error("❌ Erreur : ID du catway non défini"));

        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/${testCatwayId}`,
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        };

        const req = http.request(options, (res) => {
            assert.strictEqual(res.statusCode, 200);
            done();
        });

        req.on("error", (err) => done(err));
        req.end();
    });
});
