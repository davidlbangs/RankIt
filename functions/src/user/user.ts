import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const db = admin.firestore();

export const importUser = functions.auth.user().onCreate((user) => {
    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName;
    const newUserRef = db.collection("users").doc(uid);

    return newUserRef.set({
        uid: uid,
        email: email,
        displayName: displayName,
        roles: { user: true, admin: false, super: false}
    })
});

