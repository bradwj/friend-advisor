const admin = require("../firebase.js");
const db = admin.firestore();

async function generate () {
  let idLength = 6;
  let attempts = 1;
  let unusedIdToReturn = null;

  while (unusedIdToReturn === null) {
    unusedIdToReturn = createCode(idLength);
    console.log("Querying for: ", unusedIdToReturn);
    const boolExists = await groupExistsWithId(unusedIdToReturn);
    if (boolExists) {
      unusedIdToReturn = null;
    }
    attempts = attempts + 1;
    if (attempts >= 50 && unusedIdToReturn === null) { idLength = idLength + 1; attempts = 1; }
  }
  return unusedIdToReturn;
}

const createCode = (length) => {
  let result = "";
  const characters = "ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789"; 
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
  }
  return result;
};

async function groupExistsWithId (idToQuery) {
  const group = await db.collection("groups").where("joinId", "==", idToQuery).get();
  if (group.empty) {
    return false;
  } else {
    return true;
  }
}

exports.generate = generate;
