const AWS = require('aws-sdk');
const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');
const DomainModel = require('../models/admin/DomainManagerModel');
const { FirebaseData, PushNotification } = require("../utils/firebase.js");

AWS.config.update({
    region: process.env.S3_REGION, // Set your AWS region
    accessKeyId: process.env.S3_ACCESS_KEY, // Your access key
    secretAccessKey: process.env.S3_SECRET_KEY, // Your secret key
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const fs = require("fs");
const path = require('path');
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;








const generateRandomString = (length = 12) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };






// Controller for handling authentication
const cronController = {
    
    // beforeMeetingNotification API
    beforeMeetingNotification: async (req, res) => {
        try {
            let cognitoUserIds = ["a3f458d2-10a1-70cc-d6e3-0550a9c75624","73c478e2-f091-703a-cdf3-d1ed55eafe90"]; // Ensure this array contains valid user IDs
            

            const userToNotification = await UsersModel.find(
                {cognitoUserId: { $in: cognitoUserIds }},
                {
                    deviceToken: 1,
                    cognitoUserId: 1,
                    email: 1,
                }
            )
            .lean();

            //console.log("userToNotification", userToNotification);
            let message = "You can start meeting after 2 minutes";
            let notificationSave = {
                cognitoUserId:"a3f458d2-10a1-70cc-d6e3-0550a9c75624"
            }

            if (userToNotification && userToNotification.length > 0) {
                userToNotification.forEach(async (user) => {
                    if (Array.isArray(user.deviceToken) && user.deviceToken.length > 0) {
                        console.log("array coming for user:", user.cognitoUserId);
                        let payload = {
                            notification: {
                                title: "Meeting Reminder",
                                body: message,
                                data: notificationSave,
                                content_available: "true",
                            },
                            data: {
                                "data": JSON.stringify(notificationSave),
                            }
                        };
                        await PushNotification({ registrationToken: user.deviceToken, payload });
                    } else {
                        console.log("not array coming for user:", user.cognitoUserId);
                    }
                });
            } else {
                console.log("No users found with the given cognitoUserIds.");
            }
            return res.json({ status: 1, message: 'Push notification sent successfully', userToNotification });
        } catch (error) {
           
            return res.json({ status: 0, message: 'Push notification Error', error });
            
        }
    },

    

    
    
};
module.exports = cronController;