// Fonction pour afficher un message de 5sec succès ou échec
function displayMessage(elementId, message, isSuccess = true) {
    const messageBox = document.getElementById(elementId);
    messageBox.style.display = "block";
    messageBox.style.color = isSuccess ? "green" : "red";
    messageBox.textContent = message;

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 5000);
}

// Créer un utilisateur
document.getElementById("createUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("newUserName").value;
    const email = document.getElementById("newUserEmail").value;
    const password = document.getElementById("newUserPassword").value;

    try {
        const response = await fetch(`/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("createUserMessage", "✅ Utilisateur créé avec succès !");
            document.getElementById("createUserForm").reset();
        } else {
            displayMessage("createUserMessage", `❌ Erreur : ${data.error || "Impossible de créer l'utilisateur"}`, false);
        }
    } catch (error) {
        displayMessage("createUserMessage", `❌ Erreur inattendue : ${error.message}`, false);
    }
});


// Modifier un catway via son ID
document.getElementById("updateCatwayForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const catwayId = document.getElementById("catwayIdToUpdate").value;
    const catwayState = document.getElementById("updateCatwayState").value;

    try {
        const response = await fetch(`/catways/${catwayId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token") 
            },
            body: JSON.stringify({ catwayState })
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("updateCatwayMessage", "✅ Catway mis à jour !");
        } else {
            displayMessage("updateCatwayMessage", `❌ Erreur : ${data.error || "Impossible de modifier le catway"}`, false);
        }
    } catch (error) {
        displayMessage("updateCatwayMessage", `❌ Erreur inattendue : ${error.message}`, false);
    }
});

// Supprimer un catway via son ID
document.getElementById("deleteCatwayForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const catwayId = document.getElementById("catwayIdToDelete").value;

    try {
        const response = await fetch(`/catways/${catwayId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("deleteCatwayMessage", "✅ Catway supprimé !");
        } else {
            displayMessage("deleteCatwayMessage", `❌ Erreur : ${data.error || "Impossible de supprimer le catway"}`, false);
        }
    } catch (error) {
        displayMessage("deleteCatwayMessage", `❌ Erreur inattendue : ${error.message}`, false);
    }
});

// Modifier un user via son ID
document.getElementById("updateUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userIdToUpdate").value;
    const name = document.getElementById("updateUserName").value;
    const email = document.getElementById("updateUserEmail").value;

    try {
        const response = await fetch(`/users/update/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("updateUserMessage", "✅ Utilisateur mis à jour !");
        } else {
            displayMessage("updateUserMessage", `❌ Erreur : ${data.error || "Impossible de modifier l'utilisateur"}`, false);
        }
    } catch (error) {
        displayMessage("updateUserMessage", `❌ Erreur inattendue : ${error.message}`, false);
    }
});


// Supprimer un user via son ID
document.getElementById("deleteUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userIdToDelete").value;

    try {
        const response = await fetch(`/users/delete/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage("deleteUserMessage", "✅ Utilisateur supprimé !");
        } else {
            displayMessage("deleteUserMessage", `❌ Erreur : ${data.error || "Impossible de supprimer l'utilisateur"}`, false);
        }
    } catch (error) {
        displayMessage("deleteUserMessage", `❌ Erreur inattendue : ${error.message}`, false);
    }
});

