const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SECRET_KEY = process.env.SECRET_KEY;

// 🔹 Route pour créer un compte utilisateur
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        const newUser = new User({ name, email, password }); 

        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});



// Route pour générer un token (auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe obligatoires" });
        }

        // Vérifie si l'utilisateur existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        
        // Vérifie le mot de passe avec bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Génère un token JWT
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '30d' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});



// Route pour supprimer un utilisateur
router.delete('/delete', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "L'email est requis pour supprimer un utilisateur" });
        }

        // Vérifie si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Supprime l'utilisateur
        await User.deleteOne({ email });

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
});



module.exports = router;
