const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate(
        req.body.password,
        {
          list: true,
        }
      )}`,
    });
  }
};
