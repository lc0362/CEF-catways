// Attendre que le DOM soit chargé avant d'exécuter le script pour éviter l'erreur document.getElementById is null
document.addEventListener("DOMContentLoaded", function () {

    // Fonction pour afficher un message temporaire (5 sec)
    function displayMessage(elementId, message, isSuccess = true) {
        const messageBox = document.getElementById(elementId);
        if (!messageBox) return;
        messageBox.style.display = "block";
        messageBox.style.color = isSuccess ? "green" : "red";
        messageBox.textContent = message;

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 5000);
    }

    // Vérifier si l'utilisateur est connecté
    function checkAuth() {
        const token = localStorage.getItem("token");
        if (!token && window.location.pathname !== "/") {
            window.location.href = "/";
        }
    }
    checkAuth();

    // Déconnexion de l'utilisateur
    function logout() {
        console.log("Déconnexion en cours..."); // Debugging
        localStorage.removeItem("token"); // Supprime le token
        window.location.href = "/"; // Redirection vers la page d'accueil
    }

    document.addEventListener("DOMContentLoaded", function () {
        const logoutButton = document.querySelector(".btn-deconnexion");
        if (logoutButton) {
            logoutButton.addEventListener("click", logout);
        } else {
            console.log("❌ Bouton de déconnexion non trouvé !");
        }
    });

    // Fonction générique pour gérer les requêtes API
    async function fetchAPI(url, method, body = null, auth = true) {
        const headers = { "Content-Type": "application/json" };
        if (auth) headers["Authorization"] = "Bearer " + localStorage.getItem("token");

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        return response.json();
    }

    // Gestion de la connexion utilisateur
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const data = await fetchAPI("/auth/login", "POST", { email, password }, false);
                
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    displayMessage("loginMessage", "Connexion réussie", true);
                    setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
                } else {
                    displayMessage("loginMessage", `Erreur : ${data.error || "Identifiants incorrects"}`, false);
                }
            } catch (error) {
                displayMessage("loginMessage", `Erreur inattendue : ${error.message}`, false);
            }
        });
    }

    // Création d'un utilisateur
    const createUserForm = document.getElementById("createUserForm");
    if (createUserForm) {
        createUserForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("newUserName").value;
            const email = document.getElementById("newUserEmail").value;
            const password = document.getElementById("newUserPassword").value;

            const data = await fetchAPI("/auth/register", "POST", { name, email, password }, false);
            if (data.message) {
                displayMessage("createUserMessage", "Utilisateur créé");
                createUserForm.reset();
            } else {
                displayMessage("createUserMessage", `Erreur : ${data.error}`, false);
            }
        });
    }

    // Modifier un utilisateur via son ID
    const updateUserForm = document.getElementById("updateUserForm");
    if (updateUserForm) {
        updateUserForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userId = document.getElementById("userIdToUpdate").value;
            const name = document.getElementById("updateUserName").value;
            const email = document.getElementById("updateUserEmail").value;

            const data = await fetchAPI(`/users/update/${userId}`, "PATCH", { name, email });
            if (data.message) {
                displayMessage("updateUserMessage", "Utilisateur mis à jour");
            } else {
                displayMessage("updateUserMessage", `Erreur : ${data.error}`, false);
            }
        });
    }

    // Supprimer un utilisateur via son ID
    const deleteUserForm = document.getElementById("deleteUserForm");
    if (deleteUserForm) {
        deleteUserForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userId = document.getElementById("userIdToDelete").value;

            const data = await fetchAPI(`/users/delete/${userId}`, "DELETE");
            if (data.message) {
                displayMessage("deleteUserMessage", "Utilisateur supprimé");
            } else {
                displayMessage("deleteUserMessage", `Erreur : ${data.error}`, false);
            }
        });
    }

    // Créer un catway 
    const createCatwayForm = document.getElementById("createCatwayForm");
    if (createCatwayForm) {
        createCatwayForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const catwayNumber = document.getElementById("catwayNumber").value;
            const type = document.getElementById("type").value;
            const catwayState = document.getElementById("catwayState").value;

            const data = await fetchAPI("/catways/add", "POST", { catwayNumber, type, catwayState });
            if (data.message) {
                displayMessage("createCatwayMessage", "Catway créé");
                createCatwayForm.reset();
            } else {
                displayMessage("createCatwayMessage", `Erreur : ${data.error}`, false);
            }
        });
    }

    // Modifier un catway via son ID
    const updateCatwayForm = document.getElementById("updateCatwayForm");
    if (updateCatwayForm) {
        updateCatwayForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const catwayId = document.getElementById("catwayIdToUpdate").value;
            const catwayState = document.getElementById("updateCatwayState").value;

            const data = await fetchAPI(`/catways/${catwayId}`, "PATCH", { catwayState });
            if (data.message) {
                displayMessage("updateCatwayMessage", "Catway mis à jour");
            } else {
                displayMessage("updateCatwayMessage", `Erreur : ${data.error}`, false);
            }
        });
    }

    // Supprimer un catway via son ID
    const deleteCatwayForm = document.getElementById("deleteCatwayForm");
    if (deleteCatwayForm) {
        deleteCatwayForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const catwayId = document.getElementById("catwayIdToDelete").value;

            const data = await fetchAPI(`/catways/${catwayId}`, "DELETE");
            if (data.message) {
                displayMessage("deleteCatwayMessage", "Catway supprimé");
            } else {
                displayMessage("deleteCatwayMessage", `Erreur : ${data.error}`, false);
            }
        });
    }

    // Vérification et gestion des formulaires pour les réservations
    const createReservationForm = document.getElementById("createReservationForm");
    if (createReservationForm) {
        createReservationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const catwayId = document.getElementById("reservationCatwayId").value;
            const clientName = document.getElementById("clientName").value;
            const boatName = document.getElementById("boatName").value;
            const checkIn = document.getElementById("checkIn").value;
            const checkOut = document.getElementById("checkOut").value;

            const data = await fetchAPI(`/catways/${catwayId}/reservations`, "POST", { clientName, boatName, checkIn, checkOut });
            if (data.message) {
                displayMessage("createReservationMessage", "Réservation créée");
                createReservationForm.reset();
            } else {
                displayMessage("createReservationMessage", `Erreur : ${data.error}`, false);
            }
        });
    }
    // Supprimer une réservation 
    const deleteReservationForm = document.getElementById("deleteReservationForm");
    if (deleteReservationForm) {
        deleteReservationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const reservationId = document.getElementById("reservationIdToDelete").value;

            const data = await fetchAPI(`/reservations/${reservationId}`, "DELETE");
            if (data.message) {
                displayMessage("deleteReservationMessage", "Réservation supprimée");
            } else {
                displayMessage("deleteReservationMessage", `Erreur : ${data.error}`, false);
            }
        });
    }
});
