const Sauce = require("../models/Sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.json({ msg: "Sauce créée" }))
    .catch((error) => res.json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauceOrNot = async (req, res, next) => {
  try {
    // charge la sauce en fonction de l'id dans la req.params
    const sauce = await Sauce.findOne({ _id: req.params.id });
    // Si user n'est pas dans le tableau usersLiked et qu'il aime la sauce
    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
      await Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
        }
      );
    }
    // Si user est dans tableau usersLiked et qu'il annule son like
    else if (
      sauce.usersLiked.includes(req.body.userId) &&
      req.body.like === 0
    ) {
      await Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: -1 },
          $pull: { usersLiked: req.body.userId },
        }
      );
    }
    // Si user n'est pas dans le tableau disLiked et qu'il n'aime pas la sauce
    else if (
      !sauce.usersDisliked.includes(req.body.userId) &&
      req.body.like === -1
    ) {
      await Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        }
      );
    }
    // Si user est dans tableau disLiked et qu'il annule son disLike
    else if (
      sauce.usersDisliked.includes(req.body.userId) &&
      req.body.like === 0
    ) {
      await Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: req.body.userId },
        }
      );
    }
    res.status(200).json({ msg: "Prise en compte de votre choix" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
