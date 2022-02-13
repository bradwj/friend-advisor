const admin = require("../firebase.js");
const db = admin.firestore();

// Call with hourDiff as a numerical parameter, representing the time between the current OS time and the event/nirthday

export async function searchDates(hourDiff)
{
    const groupsRef = db.collection('groups');
    const usersRef = db.collection('users');

    const snapshot = await groupsRef.get(); //Obtain all groups
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }  

    snapshot.forEach(groupDoc => { //Loop through all groups
        const groupData = groupDoc.data().members;
        groupData.forEach(async user => { //Loop through all group members
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

