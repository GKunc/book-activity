const { authJwt } = require("../middlewares");
const controller = require("../controllers/favourite.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/favourites',  [authJwt.verifyToken], controller.getFavourites);
  app.post('/api/favourites',  [authJwt.verifyToken], controller.updateFavourites);
}