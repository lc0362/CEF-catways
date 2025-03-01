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

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.json(catways);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
        res.json(catway);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.add = async (req, res) => {
    try {
        const newCatway = new Catway(req.body);
        await newCatway.save();
        res.status(201).json(newCatway);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedCatway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.json(updatedCatway);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deletedCatway = await Catway.findByIdAndDelete(req.params.id);
        if (!deletedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.json({ message: "Catway supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

