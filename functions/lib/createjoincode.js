const generate = (length) => {
  let result = "";
  const characters = "ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
  }
  return result;
};

exports.generate = generate;
