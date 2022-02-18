const admin = require("../firebase");

const authenticate = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(403).send({ error: "Missing token" });
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(() => {
    res.status(403).send({ error: "Invalid Token" });
  });
};

module.exports = authenticate;
