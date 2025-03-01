const Reservation = require('../models/reservation');
const Catway = require('../models/catway'); 

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ email: email }, '__v -createdAt -updatedAt');
  
      if (user) {
        bcrypt.compare(password, user.password, function(err, response) {
          if (err) {
            throw new Error(err);
          }
          if (response) {
            delete user._doc.password;
  
            const expireIn = 24 * 60 * 60;
            const token = jwt.sign(
              { user: user },
              SECRET_KEY,
              { expiresIn: expireIn }
            );
  
            res.header('Authorization', 'Bearer ' + token);
  
            return res.status(200).json('authenticate_succeed');
          }
  
          return res.status(403).json('wrong_credentials');
        });
      } else {
        return res.status(404).json('user_not_found');
      }
    } catch (error) {
      return res.status(501).json(error);
    }
  };

  exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addReservation = async (req, res) => {
  try {
      const { clientName, boatName, checkIn, checkOut } = req.body;
      const catwayId = req.params.id; // Récupère l'ID du catway depuis l'URL

      if (!clientName || !boatName || !checkIn || !checkOut) {
          return res.status(400).json({ error: "Tous les champs sont obligatoires" });
      }

      // Vérifie si le catway 
      const catwayExists = await Catway.findById(catwayId);
      if (!catwayExists) {
          return res.status(404).json({ error: "Catway non trouvé" });
      }

      const newReservation = new Reservation({
          catwayNumber: catwayId,  
          clientName,
          boatName,
          checkIn,
          checkOut
      });

      await newReservation.save();
      res.status(201).json({ message: "Réservation ajoutée avec succès", reservation: newReservation });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


exports.updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.idReservation, req.body, { new: true });
        if (!updatedReservation) return res.status(404).json({ message: "Réservation non trouvée" });
        res.json(updatedReservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!deletedReservation) return res.status(404).json({ message: "Réservation non trouvée" });
        res.json({ message: "Réservation supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};