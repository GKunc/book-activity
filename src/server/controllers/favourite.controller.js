const FavouriteService = require('../services/favourite.service');

exports.getFavourites = async (req, res) => {
  const favourites = await FavouriteService.getFavourites(req.query.id);
  return res.send(JSON.stringify(favourites));
};

exports.updateFavourites = async (req, res) => {
  await FavouriteService.updateFavourites(req.body.userId, req.body.favourites[0], req.body.isNew);
  return res.sendStatus(200);
};
