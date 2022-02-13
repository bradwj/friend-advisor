const admin = require("../firebase.js");
const db = admin.firestore();


export async function searchBirthdays(hourDiff)
{
    const groupsRef = db.collection('groups');
    const usersRef = db.collection('users');

    const snapshot = await groupsRef.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }  

    snapshot.forEach(groupDoc => {
        const groupData = groupDoc.data().members;
        groupData.forEach(async user => {
            const currentUser = await usersRef.doc(user).get();

            //console.log('User found: '+currentUser.id);
            if (!currentUser.data()?.dob) {return;}

            const userDate = new Date(currentUser.data().dob);
            const currentDate = new Date();
            const hoursDifferent = (userDate-currentDate) / ((1000) * (60) * (60));
            //console.log(hoursDifferent, userDate, currentDate);
            if (hoursDifferent <= hourDiff && hoursDifferent >= 0)
            {
                console.log("It is "+(currentUser.data().name)+"'s birthday in approx. "+ (Math.ceil(hoursDifferent)) + " hours!");
            }
        })
    });
}

