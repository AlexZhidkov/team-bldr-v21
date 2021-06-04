const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

const firebase = require("firebase");
firebase.initializeApp({
    apiKey: 'AIzaSyAX7z8C60wsmx071CEXI36afIdW0dRwecw',
    authDomain: 'team- bldr.firebaseapp.com',
    projectId: 'team-bldr',
});

const db = firebase.firestore();

exports.sendWebpushMessage = functions.region('australia-southeast1').https.onCall((data, context) => {
    db.doc('users/' + data.userId).get().then((user) => {
        if (!user.exists) {
            throw new functions.https.HttpsError('not-found', 'User record not found for ID ' + data.userId);
        }

        const message = {
            webpush: data.webpush,
            token: user.data().fcmToken,
        };

        console.log(message);

        // Send a message to the device corresponding to the provided registration token.
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                throw new functions.https.HttpsError('internal', error);
            });
    });
});

exports.eventRegistration = functions.region('australia-southeast1').https.onCall((data, context) => {
    db.doc('users/' + data.userId).get().then((user) => {
        if (!user.exists) {
            throw new functions.https.HttpsError('not-found', 'User record not found for ID ' + data.userId);
        }

        console.log(message);
    });
});
