const db = require("../models");
const Favourite = db.favourite;

exports.getFavourites = async (req, res) => {
  const id = req.query.id;
  console.log('getFavourites', id)
  const favourites = await Favourite.findOne({ userId: id });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(favourites));
}

exports.updateFavourites = async (req, res) => {
  console.log('updateFavourites', req.body)
  const userId = req.body.favourite.userId;
  const newFavourite = req.body.favourite.favourites[0];
  const favourite = await Favourite.findOne({ userId });
  const favourites = favourite?.favourites ?? null;

  if(!favourites) {
    await Favourite.create({ userId, favourites });
    res.sendStatus(200);
    return;
  }

  if(!favourites?.includes(newFavourite) && newFavourite.isNew) {
    favourites.push(newFavourite);
  } else if(favourites?.includes(newFavourite) && !newFavourite.isNew) {
    favourites.filter(item => item !== newFavourite.guid);
  }
  await Favourite.replaceOne({ userId }, { userId, favourites });
  res.sendStatus(200);
}
