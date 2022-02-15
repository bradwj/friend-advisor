const admin = require("../firebase.js");
const db = admin.firestore();

async function generate () {
  const existingIds = await getAllExistingIds();
  let idLength = 6;
  let attempts = 1;
  let unusedIdToReturn = null;

  while (unusedIdToReturn === null) {
    unusedIdToReturn = createCode(idLength);

    for (const groupDoc of existingIds) {
      const groupData = groupDoc.data();
      const joinId = groupData.joinId;
      console.log(joinId, "compared to", unusedIdToReturn);
      if (joinId === unusedIdToReturn) {
        unusedIdToReturn = null;
        break;
      }
    }

    attempts = attempts + 1;
    if (attempts >= 50 && unusedIdToReturn === null) {idLength = idLength + 1; attempts = 1;}
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

async function getAllExistingIds()
{
  group = await db.collection("groups").get();
  const fixed = [];
  group.forEach(elem => fixed.push(elem));
  return fixed;
}

exports.generate = generate;
