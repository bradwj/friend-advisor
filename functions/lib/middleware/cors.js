const allowOrigin = (req, res, next) => {
  res.set("Access-Control-Allow-Origin",
    process.env.NODE_ENV === "development" ? "*" : "https://friendadvisor.tech"
  );
  next();
};

module.exports = allowOrigin;
