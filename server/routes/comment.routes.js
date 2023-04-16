const { authJwt } = require("../middlewares");
const controller = require("../controllers/comment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/comments', controller.getComments);
  app.post('/api/comments', [authJwt.verifyToken], controller.addComment);
}