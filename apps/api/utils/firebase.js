const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Crypto Encrypting text
async function FirebaseData(data) {
  try {
    // var userRecord = await admin.auth().createUser({
    //   email: data.email,
    //   emailVerified: false,
    //   //phoneNumber: data.phone,
    //   password: "",
    //   displayName: data.first_name + " " + data.last_name,
    //   //photoURL: 'http://www.example.com/12345678/photo.png',
    //   disabled: false,
    // });
    // return { status: 1, uid: userRecord.uid };
    return { status: 1 };
  } catch (err) {
    return { status: 0, error: err };
  }
}

// Push Notification
async function PushNotification(data) {
  console.log("Push notification calling...");
  //console.log("Data:", data);

  try {
    const options = {
      priority: "high",
    };

    const response = await admin.messaging().sendEachForMulticast({
      tokens: data.registrationToken, // Array of device tokens
      notification: {
        title: data.payload.notification.title,
        body: data.payload.notification.body,
      },
      data: data.payload.data, // Additional data
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
    });

    console.log("Push notification response:", response);
    return {
      status: 1,
      message: "Message successfully sent!",
      response,
    };
  } catch (error) {
    console.error("Push notification error:", error);
    return {
      status: 0,
      message: error.message,
    };
  }
}

module.exports = { FirebaseData, PushNotification };
