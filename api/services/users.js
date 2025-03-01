const User = require('../models/user'); 

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclut le mot de passe des résultats
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Modifier un utilisateur via son ID
exports.updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Vérifie si l'utilisateur existe
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { name, email }, 
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

        res.json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un utilisateur via son ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

        res.json({ message: "✅ Utilisateur supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
