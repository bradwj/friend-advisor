console.log("current rates" + global.ratesStore);
global.ratesStore = global.ratesStore || Object.create(null);

const rateLimited = (req, res, seconds) => {
  console.log("rate => ", global.ratesStore[req.user.uid], (Date.now() - global.ratesStore[req.user.uid]));
  if (global.ratesStore[req.user.uid] && (Date.now() - global.ratesStore[req.user.uid]) <= seconds * 1000) {
    res.status(429).send({ message: "Rate limited" });
    return true;
  }
  global.ratesStore[req.user.uid] = Date.now();
};

module.exports = rateLimited;
