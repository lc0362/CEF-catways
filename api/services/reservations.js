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

exports.getAllReservations = (req, res) => {
    res.json({ message: "Toutes les reservations" });
};

exports.getReservationById = (req, res) => {
    res.json({ message: `Reservation ID: ${req.params.id}` });
};

exports.addReservation = (req, res) => {
    res.json({ message: "Reservation ajoutée !" });
};

exports.updateReservation = (req, res) => {
    res.json({ message: `Reservation ID: ${req.params.id} mise à jour !` });
};

exports.deleteReservation = (req, res) => {
    res.json({ message: `Reservations ID: ${req.params.id} supprimée !` });
};

exports.authenticate = (req, res) => {
    res.json({ message: "Authentification réussie !" });
};
