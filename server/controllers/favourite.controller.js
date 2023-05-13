const db = require('../models');
const Favourite = db.favourite;

exports.getFavourites = async (req, res) => {
  const id = req.query.id;
  console.log('getFavourites', id);
  const favourites = await Favourite.findOne({ userId: id });
  return res.send(JSON.stringify(favourites));
};

exports.updateFavourites = async (req, res) => {
  console.log('updateFavourites', req.body);

  const userId = req.body.userId;
  const newFavourite = req.body.favourites[0];
  const favourite = await Favourite.findOne({ userId: userId });
  if (!favourite) {
    await Favourite.create({ userId, favourites: [newFavourite] });
    return res.sendStatus(200);
  }

  let favourites = favourite?.favourites ?? [];
  if (!favourites?.includes(newFavourite) && req.body.isNew) {
    favourites = [...favourites, newFavourite];
  } else if (favourites?.includes(newFavourite) && !req.body.isNew) {
    favourites = favourites.filter((item) => item !== newFavourite);
  }
  await Favourite.replaceOne({ userId }, { userId, favourites });
  return res.sendStatus(200);
};
