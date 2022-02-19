const allowOrigin = (req, res, next) => {
  res.set("Access-Control-Allow-Origin",
    process.env.NODE_ENV === "development" ? "*" : "https://friendadvisor.tech"
  );
  res.set("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH");
  next();
};

module.exports = allowOrigin;
