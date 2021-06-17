const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


const admin = require('firebase-admin');
admin.initializeApp();

const firebase = require("firebase");
firebase.initializeApp({
    apiKey: '',
    authDomain: 'team- bldr.firebaseapp.com',
    projectId: 'team-bldr',
});
const db = firebase.firestore();

const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// 3. Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

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

exports.sendEmail = functions.region('australia-southeast1').https.onCall(async (data, context) => {
    const mailOptions = {
        from: `Team Builder App <${gmailEmail}>`,
        to: `${data.memberEmail}`,
    };

    const dateTime = new Date(data.dateTime)
    const eventTime = `${dateTime?.toDateString()} at ${dateTime?.toTimeString().substring(0, 5)}`;
    const eventMessage = data.message;
    const urlTeamEvent = `https://team-bldr.web.app/event/${data.teamId}/${data.eventId}/`;
    const urlAccept = urlTeamEvent + 'accepted';
    const urlReject = urlTeamEvent + 'rejected';

    mailOptions.subject = `${data.teamName}`;

    mailOptions.text = `${eventTime}`;
    mailOptions.text = `\n${data.message}`;
    mailOptions.text = `\n Accept: ${urlAccept}`;
    mailOptions.text = `\n Reject: ${urlReject}`;
    mailOptions.text = `\n Event: ${urlTeamEvent}`;

    mailOptions.html = `<h3>${eventTime}</h3><p>${eventMessage}</p><table width="100%" cellspacing="0" cellpadding="0"> <tr> <td> <table cellspacing="0" cellpadding="0"> <tr> <td style="border-radius: 2px;" bgcolor="green"> <a href="${urlAccept}" target="_blank" style="padding: 8px 12px; border: 1px solid #ff4081;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;"> Accept </a> </td> </tr> </table> </td> <td> <table cellspacing="0" cellpadding="0"> <tr> <td style="border-radius: 2px;" bgcolor="f44336"> <a href="${urlReject}" target="_blank" style="padding: 8px 12px; border: 1px solid #ff4081;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;"> Reject </a> </td> </tr> </table> </td> <td> <table cellspacing="0" cellpadding="0"> <tr> <td style="border-radius: 2px;" bgcolor="#3f51b5"> <a href="${urlTeamEvent}" target="_blank" style="padding: 8px 12px; border: 1px solid #ff4081;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Event</a></td></tr></table></td></tr></table>`;

    await mailTransport.sendMail(mailOptions);
    functions.logger.log('New email sent to: ', data.memberEmail);
    return null;
});
