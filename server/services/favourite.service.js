const Favourite = require('../models/favourite.model');

async function getFavourites(userId) {
  return Favourite.findOne({ userId });
}

async function updateFavourites(userId, newFavourite, isNew) {
  const favourite = await Favourite.findOne({ userId });
  if (!favourite) {
    await Favourite.create({ userId, favourites: [newFavourite] });
    return res.sendStatus(200);
  }

  let favourites = favourite?.favourites ?? [];
  if (!favourites?.includes(newFavourite) && isNew) {
    favourites = [...favourites, newFavourite];
  } else if (favourites?.includes(newFavourite) && isNew) {
    favourites = favourites.filter((item) => item !== newFavourite);
  }
  await Favourite.replaceOne({ userId }, { userId, favourites });
}

const FavouriteService = {
  getFavourites,
  updateFavourites,
};

module.exports = FavouriteService;
