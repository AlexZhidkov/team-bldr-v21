const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');

exports.sendTestMessageToAlexPhone = functions.region('australia-southeast1').https.onCall((data, context) => {
    // This registration token comes from the client FCM SDKs.
    const registrationToken = '';

    const message = {
        data: {
            score: '850',
            time: '2:45',
        },
        token: registrationToken,
    };


    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
});
