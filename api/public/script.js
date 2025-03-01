document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
    } else {
        alert("Erreur : " + data.error);
    }
});

// Afficher un message de succès ou d'erreur
function displayMessage(elementId, message, isSuccess = true) {
    const messageBox = document.getElementById(elementId);
    messageBox.style.display = "block";
    messageBox.style.color = isSuccess ? "green" : "red";
    messageBox.textContent = message;

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 5000); // Masquer après 5 secondes
}

