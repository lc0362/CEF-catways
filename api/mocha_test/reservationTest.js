const assert = require("assert");
const http = require("http");

const BASE_URL = "http://localhost:8080";
let authToken = "";
let testReservationId = "";

// 🔑 Récupérer un token d'authentification avant les tests
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

describe("🛠️ Tests API Réservations (avec authentification)", function () {
    // ✅ Ajouter une réservation
    it("✅ Ajouter une réservation", function (done) {
        const postData = JSON.stringify({
            clientName: "Paul",
            boatName: "Sea Breeze",
            checkIn: "2025-05-01T10:00:00Z",
            checkOut: "2025-05-05T10:00:00Z",
        });

        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/67c9995996402baf6174e0d0/reservations`, // 📌 Catway existant en BDD
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
                console.log("🔹 Réponse brute du serveur (POST /reservations) :", body);
    
                try {
                    const response = JSON.parse(body);
                    
                    if (!response.reservation || !response.reservation._id) {
                        return done(new Error("❌ Erreur : ID de la réservation non récupéré !"));
                    }
                    
                    testReservationId = response.reservation._id; 
                    console.log("🆔 ID de la réservation créée :", testReservationId);
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        req.on("error", (err) => done(err));
        req.write(postData);
        req.end();
    });

    // GET /catways/:id/reservations - Récupérer toutes les réservations d'un catway
    it("✅ Récupérer toutes les réservations d'un catway", function (done) {
        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/67c350461e6dc6c2e5683882/reservations`, // Utilisation d'un catway ID qui a une réservation dans la BDD
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

    // GET /catways/:id/reservations - Récupérer une réservation spécifique d'un catway
    it("✅ Récupérer une réservation spécifique d'un catway", function (done) {
        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/67c350461e6dc6c2e5683882/reservations/67c5a8ddc1c2afc07b3807ff`, // Utilisation d'une réservation existante dans la BDD
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

    // ✅ Supprimer une réservation
    it("✅ Supprimer une réservation", function (done) {
        if (!testReservationId) return done(new Error("❌ Erreur : ID de la réservation non défini"));

        const options = {
            hostname: "localhost",
            port: 8080,
            path: `/catways/67c350461e6dc6c2e5683882/reservations/${testReservationId}`,
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        };

        console.log("🗑️ Tentative de suppression de la réservation ID :", testReservationId);

        const req = http.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                console.log("🔹 Réponse brute du serveur (DELETE /reservations) :", body);

                try {
                    const response = JSON.parse(body);
                    
                    if (res.statusCode === 404) {
                        console.error("❌ La réservation à supprimer n'a pas été trouvée !");
                        return done(new Error("❌ Réservation introuvable lors de la suppression"));
                    }

                    assert.strictEqual(res.statusCode, 200);
                    console.log("✅ Réservation supprimée avec succès !");
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        req.on("error", (err) => done(err));
        req.end();
    });
});
