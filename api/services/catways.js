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

exports.getAllCatways = (req, res) => {
    res.json({ message: "Tous les catways" });
};

exports.getById = (req, res) => {
    res.json({ message: `Catway ID: ${req.params.id}` });
};

exports.add = (req, res) => {
    res.json({ message: "Catway ajouté !" });
};

exports.update = (req, res) => {
    res.json({ message: `Catway ID: ${req.params.id} mis à jour !` });
};

exports.delete = (req, res) => {
    res.json({ message: `Catway ID: ${req.params.id} supprimé !` });
};

exports.authenticate = (req, res) => {
    res.json({ message: "Authentification réussie !" });
};
