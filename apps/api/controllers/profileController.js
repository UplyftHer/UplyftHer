const mongoose = require('mongoose');
//const io = require("../server");
const { io, connectedUsers } = require("../server");
const SavedProfilesModel = require('../models/SavedProfiles');
const ConnectedUserModel = require('../models/ConnectedUserModel');
const UnConnectedUserModel = require('../models/UnConnectedUserModel');
const NotificationModel = require('../models/NotificationModel');
const ChatModel = require('../models/ChatModel');
const UsersModel = require('../models/UsersModel');
const AvailabilityModel = require('../models/AvailabilityModel');
const BookMeetingsModel = require('../models/BookMeetingsModel');
const feedbackModel = require('../models/feedbackModel');
const interactedUserModel = require('../models/interactedUserModel');
const InterestsModel = require('../models/admin/InterestsModel');
const IndustryModel = require('../models/admin/IndustryModel');
const BlockedUsers = require('../models/BlockedUsers.js');
const DeletedUsers = require('../models/deletedUsersModel.js');
const OrganizationsModel = require('../models/OrganizationsModel.js');
const { contactUsEmailBodyDSAR, contactUsEmailBody } = require('../emailTemplates/emailTemplates.js');

const sendEmail = require('../utils/emailSender');
const { FirebaseData, PushNotification } = require("../utils/firebase.js");


const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
//const moment = require('moment');
const moment = require("moment-timezone");
// Initialize AWS Cognito Identity Provider
AWS.config.update({
    region: process.env.S3_REGION, // Set your AWS region
    accessKeyId: process.env.S3_ACCESS_KEY, // Your access key
    secretAccessKey: process.env.S3_SECRET_KEY, // Your secret key
});

const cognito = new AWS.CognitoIdentityServiceProvider();



const fs = require("fs");
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function uploadToS3(fileName) {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: 'image/jpeg', // Set the Content-Type here
        ContentDisposition: 'inline', // Set Content-Disposition to "inline"
    };

    // Uploading files to the bucket
    await s3.upload(params, async function (err, data) {
        if (err) {
            throw err;
        }
        //console.log(`File uploaded successfully. ${data.Location}`);
        return await data.Location;
    });
}
async function getUserRating(data) {

    const feedbackData = await feedbackModel.aggregate([
        {
            $match: { toId: data.cognitoUserIdMy }
        },
        {
            $group: {
                _id: "$toId",
                averageRating: { $avg: "$rating" },
                ratings: { $push: "$rating" }
            }
        }
    ]);

    if (feedbackData.length > 0) {
        //console.log("Average Rating:", feedbackData[0].averageRating.toFixed(1));
        //console.log("All Ratings:", feedbackData[0].ratings);
        return feedbackData[0].averageRating.toFixed(1);
    } else {
        //console.log("No ratings found for this user.");
        return 0;
    }
}

function convertTo24hr(time12hr) {
    const [time, modifier] = time12hr.split(" ");
    let [hours, minutes] = time.split(":");

    // Convert hour from string to number for comparison
    hours = parseInt(hours);

    // Convert 12 AM to 00:00
    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    // Convert 12 PM to 12:00
    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }

    // Return in 24-hour format as a string
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const profileController = {
    // Logout API
    logout: async (req, res) => {

        const { deviceToken } = req.body;

        try {

            const update = {
                $pull: { deviceToken }
            };
            const profile = await UsersModel.findOneAndUpdate(
                { deviceToken },
                update,
                { new: true }
            );



            return res.json({ status: 1, message: 'User logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    testUserDelete: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await UsersModel.findOne({ email });
            console.log("useruser", user);
            if (!user) {
                return res.json({ status: 0, message: 'User not found' });
            }

            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: user.cognitoUserId,
            };


            await cognito.adminDeleteUser(params).promise();
            await UsersModel.deleteOne({ cognitoUserId: user.cognitoUserId });
            await AvailabilityModel.deleteOne({ cognitoUserId: user.cognitoUserId });




            // Respond with success message
            return res.json({ status: 1, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    deleteUser: async (req, res) => {
        console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;

        try {
            const {reason} = req.body;
            const user = await UsersModel.findOne({ cognitoUserId });
            if (!user) {
                return res.json({ status: 0, message: 'User not found' });
            }

            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: cognitoUserId,
            };


            await cognito.adminDeleteUser(params).promise();


            await UsersModel.deleteMany({ cognitoUserId });
            await AvailabilityModel.deleteMany({ cognitoUserId });
            await BlockedUsers.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId }, 
                    { blockedUserId: cognitoUserId }
                ]
            });
            await BookMeetingsModel.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId }, 
                    { cognitoUserIdMenter: cognitoUserId }
                ]
            });
            await ChatModel.deleteMany({
                $or: [
                    { fromId: cognitoUserId }, 
                    { toId: cognitoUserId }
                ]
            });
            await ConnectedUserModel.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId }, 
                    { cognitoUserIdSave: cognitoUserId }
                ]
            });
            await feedbackModel.deleteMany({
                $or: [
                    { fromId: cognitoUserId }, 
                    { toId: cognitoUserId }
                ]
            });
            await interactedUserModel.deleteMany({
                $or: [
                    { fromcognitoUserId: cognitoUserId }, 
                    { tocognitoUserId: cognitoUserId }
                ]
            });
            await NotificationModel.deleteMany({
                $or: [
                    { fromCognitoId: cognitoUserId }, 
                    { toCognitoId: cognitoUserId }
                ]
            });
            await SavedProfilesModel.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId }, 
                    { cognitoUserIdSave: cognitoUserId }
                ]
            });
            await UnConnectedUserModel.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId }, 
                    { cognitoUserIdSave: cognitoUserId }
                ]
            });

            let deleteUserSave = await DeletedUsers.create({
                email: user.email,
                reason:reason,

            });

            // Respond with success message
            return res.json({ status: 1, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    blockUser: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        

        try {
            const { cognitoUserId, status, reason} = req.body;
            if (!cognitoUserId || !status) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            var myProfile = await UsersModel.findOne({ cognitoUserId: cognitoUserIdMy });
            if (!myProfile) {
                return res.status(200).json({ status: 0, message: 'Invalid user' });
            }
            var blockedUser = await UsersModel.findOne({ cognitoUserId: cognitoUserId });
            if (!blockedUser) {
                return res.status(200).json({ status: 0, message: 'Invalid cognitoUserId' });
            }
            let checkBlocked = await BlockedUsers.findOne({ cognitoUserId: cognitoUserIdMy, blockedUserId: cognitoUserId });
            if(checkBlocked)
            {
                
                await BlockedUsers.deleteOne({
                    cognitoUserId: cognitoUserIdMy,
                    blockedUserId: cognitoUserId,
                });
                return res.status(200).json({ status: 1, message: 'User Unblocked successfully' });
            }
            else
            {
                let blockUserSave = await BlockedUsers.create({
                    cognitoUserId: cognitoUserIdMy,
                    blockedUserId:cognitoUserId,
                    status:status,
                    reason:reason,
    
                });
                return res.status(200).json({ status: 1, message: 'User Blocked successfully' });
            }
            
            
        } catch (error) {
            console.error('Blocked user error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    getBlockedUsers: async (req, res) => {
        try {
            // Extract token and decode cognitoUserId
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const cognitoUserIdMy = decoded.username;
            const getBlockedUser = await BlockedUsers.find({ cognitoUserId: cognitoUserIdMy });
            if (!getBlockedUser || getBlockedUser.length === 0) {
                return res.status(200).json({ status: 1, message: 'No blocked user found',data: getBlockedUser });
            }
            const blockedUserIds = getBlockedUser.map(user => user.blockedUserId);
            const blockedUsersData = await UsersModel.find({ cognitoUserId: { $in: blockedUserIds } });
            return res.status(200).json({ status: 1, message: 'Blocked users found', data: blockedUsersData });

        } catch (error) {
            console.error('Blocked user error:', error);
            return res.status(500).json({ status: 0, message: error.message });
        }
    },

    changePassword: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //res.status(201).json({ decoded });
        const cognitoUserId = decoded.username;
        let accessToken = decoded.accessToken;
        // const refreshToken = decoded.refreshToken;

        //  // Check if access token is expired
        //  const currentTime = Math.floor(Date.now() / 1000);
        //  if (decoded.exp < currentTime) {
        //      // Generate new access token using refresh token
        //      const params = {
        //          AuthFlow: 'REFRESH_TOKEN_AUTH',
        //          ClientId: process.env.COGNITO_CLIENT_ID,
        //          AuthParameters: { REFRESH_TOKEN: refreshToken }
        //      };

        //      const data = await cognito.initiateAuth(params).promise();
        //      accessToken = data.AuthenticationResult.AccessToken;
        //  }

        const { oldPassword, newPassword } = req.body;

        const params = {
            AccessToken: accessToken,
            PreviousPassword: oldPassword,
            ProposedPassword: newPassword
        };

        try {
            // Change the user's password
            await cognito.changePassword(params).promise();
            //res.status(200).json({ message: 'Password changed successfully' });
            return res.json({ status: 1, message: 'Password changed successfully' });

        } catch (error) {
            //console.error('Change password error:', error);
            //res.status(500).json({ message: 'Error during password change', error: error.message });
            let errormessage = error.message;
            if (error.message == "Incorrect username or password.") {
                errormessage = "Password does not match";
            }
            else if (error.message == "Password did not conform with policy: Password must have uppercase characters") {
                errormessage = "Password did not confirm with policy: Password must have uppercase characters";
            }

            if(error.message == "Access Token has expired")
            {
                //return res.json({ status: 0, message: errormessage });
                res.status(401).json({ status: 0, message: errormessage });
            }
            else
            {
                return res.json({ status: 0, message: errormessage });
            }
            
        }
    },

    // Edit profile with new fields
    editProfile: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; // Extract token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        //res.status(201).json({ decoded });
        // const cognitoUserId = decoded.username; // Get user ID from token



        const { fullName, age, location, userType, occupation, organizationName, industry, bio, country, city, iso2} = req.body; // Data from request body
        console.log("reqbody", req.body);
        //console.log("reqbodyJson=>>>", JSON.stringify(req.body));
        let interests = req.body.interests;
        let preference = req.body.preference;

        // Remove any leading or trailing single quotes that may exist
        if (interests.startsWith("'") && interests.endsWith("'")) {
            interests = interests.slice(1, -1);
        }
        if (preference.startsWith("'") && preference.endsWith("'")) {
            preference = preference.slice(1, -1);
        }
        let parsedDataInterests;
        let parsedDataPreference;
        try {
            // Now parse the cleaned JSON string
            parsedDataInterests = JSON.parse(interests);
            //console.log("parsedData=>>>", parsedDataInterests);
        } catch (error) {
            //console.error("Error parsing interests:", error);
        }
        try {
            // Now parse the cleaned JSON string
            parsedDataPreference = JSON.parse(preference);
            //console.log("parsedData=>>>parsedDataPreference", parsedDataPreference);
        } catch (error) {
            //console.error("Error parsing parsedDataPreference:", error);
        }

        try {
            if (!country) {
                return res.status(200).json({
                    status: 0,
                    message: "Country is required",
                });
            }
            else if (!city) {
                return res.status(200).json({
                    status: 0,
                    message: "City is required",
                });
            }
            if (userType != 0 && userType != 1) {
                return res.json({ status: 0, message: "Invalid userType" });
            }
            // Validation for `interests`
            if (!Array.isArray(parsedDataInterests)) {
                return res.json({ status: 0, message: "Interests must be an array." });
            }

            if (parsedDataInterests.length === 0) {
                return res.json({ status: 0, message: "Interests array cannot be empty." });
            }

            // Validation for `preference`
            if (!Array.isArray(parsedDataPreference)) {
                return res.json({ status: 0, message: "Preference must be an array." });
            }

            if (parsedDataPreference.length === 0) {
                return res.json({ status: 0, message: "Preference array cannot be empty." });
            }
            const filter = { cognitoUserId: decoded.username };
            const update = {
                fullName,
                age,
                location,
                userType,
                occupation,
                organizationName,
                industry,
                interests: parsedDataInterests,
                bio,
                country,
                city,
                iso2,
                preference: parsedDataPreference,
                isCreateProfile: 1
            };
            if (req.files && req.files.profilePic) {

                var currentDate = Date.now();
                let photoFile = req.files.profilePic;
                let photoFileOrg = photoFile.name;
                const documentFileName = currentDate + "" + photoFileOrg;
                var filePathEvent = `Uploads/Images/${documentFileName}`;

                await photoFile.mv(filePathEvent);
                var imageurl = await uploadToS3(filePathEvent);
                fs.unlinkSync(filePathEvent);
                update.profilePic = filePathEvent;

            }

            const profile = await UsersModel.findOneAndUpdate(filter, update, { new: true });
            const checkOrganization = await OrganizationsModel.findOne({ organizationName: organizationName });
            if(!checkOrganization)
            {
                const organizationData = new OrganizationsModel({
                    organizationName
                });
                await organizationData.save();
            }

            


            return res.json({ status: 1, message: 'Profile saved successfully', data: profile });
            //res.status(201).json({ message: 'Profile saved successfully' });
        } catch (error) {
            //res.status(500).json({ message: 'Error saving profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },
    // Edit Email
    editEmail: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const cognitoUserId = decoded.username;
        //const cognitoUserId = "43346822-5091-700d-a512-b9a39bbb7726";



        const {oldEmail, newEmail} = req.body; // Data from request body
       
        
       

        try {
            if (!oldEmail || !newEmail) {
                return res.status(200).json({
                    status: 0,
                    message: "New email is required",
                });
            }
            const lowerOldEmail = oldEmail.toLowerCase();
            const lowerNewEmail = newEmail.toLowerCase();

            // ✅ Check if new email is valid
            if (!isValidEmail(lowerNewEmail)) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid email format",
                });
            }

            // Find the user in DB
            const user = await UsersModel.findOne({ email: lowerOldEmail });
            if (!user) {
                return res.status(200).json({
                    status: 0,
                    message: "User not found",
                });
            }

            // Find the new email alredy exists in DB
            const emailExists = await UsersModel.findOne({ email: lowerNewEmail });
            if (emailExists) {
                return res.status(200).json({
                    status: 0,
                    message: "Email already in use",
                });
            }

            // Cognito Update User Attributes
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: user.cognitoUserId,
                UserAttributes: [
                { Name: "email", Value: lowerNewEmail },
                { Name: "email_verified", Value: "false" }, // Email must be verified again
                ],
            };
        
            await cognito.adminUpdateUserAttributes(params).promise();
            

            // Update MongoDB (Optional: Keep email unverified until confirmed)
            
            // let updatedUser = await UsersModel.findOneAndUpdate(
            //     { _id: user._id }, 
            //     { email: lowerNewEmail, isVerified: 0 }, 
            //     { new: true } // ✅ This ensures the response contains updated data
            // );

            return res.json({ status: 1, message: 'A verification code has been sent to your new email.', data: user });

            //res.status(201).json({ message: 'Profile saved successfully' });
        } catch (error) {
            //res.status(500).json({ message: 'Error saving profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    confirmNewEmail: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const cognitoUserId = decoded.username;
        let accessToken = decoded.accessToken;
        //const cognitoUserId = "43346822-5091-700d-a512-b9a39bbb7726";



        const {email, confirmationCode} = req.body; // Data from request body
        
        
       

        try {
            if (!email || !confirmationCode) {
                return res.status(200).json({
                    status: 0,
                    message: "Email and confirmation code are required",
                });
            }
            const lowerEmail = email.toLowerCase();
            

            // Find the user in DB
            const user = await UsersModel.findOne({ cognitoUserId: cognitoUserId });
            if (!user) {
                return res.status(200).json({
                    status: 0,
                    message: "User not found",
                });
            }

            // const usercognito = await cognito.adminGetUser({
            //     UserPoolId: process.env.COGNITO_USER_POOL_ID,
            //     Username: "932448c2-f051-702e-b04e-d514bfcd6fa7", // Get from the database
            // }).promise();
            
            // console.log("User Attributes:", usercognito.UserAttributes);

            // Confirm email update in Cognito
            // const params = {
            //     ClientId: process.env.COGNITO_CLIENT_ID,
            //     Username: lowerEmail,
            //     ConfirmationCode: confirmationCode,
            // };
            // await cognito.confirmSignUp(params).promise();
            // ✅ Confirm email update in Cognito
        const params = {
            AccessToken: accessToken, // User must be logged in
            AttributeName: "email",
            Code: confirmationCode,
        };

        await cognito.verifyUserAttribute(params).promise();

            // Mark email as verified in MongoDB
            await UsersModel.updateOne({ _id: user._id }, { email: lowerEmail, isVerified: 1 });
            let updatedUser = await UsersModel.findOneAndUpdate(
                { _id: user._id }, 
                { isVerified: 1 }, 
                { new: true } // ✅ This ensures the response contains updated data
            );
            return res.json({ status: 1, message: 'Your email has been successfully verified and linked to your account.', data: updatedUser });

            //res.status(201).json({ message: 'Profile saved successfully' });
        } catch (error) {
            //res.status(500).json({ message: 'Error saving profile', error });
            let errormessage = error.message;
            if(error.message == "Access Token has expired")
            {
                //return res.json({ status: 0, message: errormessage });
                res.status(401).json({ status: 0, message: errormessage });
            }
            else
            {
                return res.json({ status: 0, message: errormessage });
            }
            
        }
    },

    // Fetch profile by cognitoUserId
    getProfile: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; // Extract token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        //console.log("decoded",decoded);
        const cognitoUserId = decoded.username; // Get user ID from token

        //console.log("cognitoUserId",cognitoUserId);

        try {

            const profile = await UsersModel.findOne(
                { cognitoUserId },
                //{ cognitoUserId: 0 } // Projection to exclude fields
            );
            if (!profile) return res.json({ status: 0, message: "Profile not found" });

            //res.status(200).json(profile);
            return res.json({ status: 1, message: 'Profile detail', data: profile });
        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    // Fetch profile by cognitoUserId
    availibiltyNewMatches: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; // Extract token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        //console.log("decoded",decoded);
        const cognitoUserId = decoded.username; // Get user ID from token

        //console.log("cognitoUserId",cognitoUserId);
        const { isMatchAvailibilty } = req.body; // Data from request body
        try {

            const filter = { cognitoUserId: cognitoUserId };
            const update = {
                isMatchAvailibilty
            };
            const profile = await UsersModel.findOneAndUpdate(filter, update, { new: true });


            return res.json({ status: 1, message: 'Availibilty update successfully', data: profile });
        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    communicationPreferences: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;


        const { status, type } = req.body;
        try {
            const filter = { cognitoUserId: cognitoUserId };
            let update = {};


            if (type === "audio") {
                update = { "communicationPreferences.audioCall": status };
            } else if (type === "video") {
                update = { "communicationPreferences.videoCall": status };
            } else if (type === "chat") {
                update = { "communicationPreferences.inPerson": status };
            }


            const profile = await UsersModel.findOneAndUpdate(filter, { $set: update }, { new: true });


            return res.json({ status: 1, message: 'Availability updated successfully', data: profile });
        } catch (error) {

            return res.json({ status: 0, message: error.message });
        }
    },

    addAvailibilty: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;

        const { slots } = req.body;
        try {
            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            let availability = await AvailabilityModel.findOne({ cognitoUserId });

            if (!availability) {
                availability = new AvailabilityModel({ cognitoUserId, slots: [] });
            }


            slots.forEach((newSlot) => {

                const existingSlotIndex = availability.slots.findIndex(
                    (slot) => slot.type === newSlot.type && slot.name === newSlot.name
                );

                if (existingSlotIndex !== -1) {

                    const existingSlot = availability.slots[existingSlotIndex];
                    newSlot.slot.forEach((timeSlot) => {
                        if (!existingSlot.slot.some((existingTime) => existingTime.time === timeSlot.time)) {
                            existingSlot.slot.push(timeSlot);
                        }
                    });

                    if (newSlot.status !== undefined) {
                        existingSlot.status = newSlot.status;
                    }
                } else {

                    availability.slots.push(newSlot);
                }
            });


            const updatedAvailability = await availability.save();

            const connectedList = await ConnectedUserModel.find({
                $or: [
                    { cognitoUserId: cognitoUserId, isChat: 1 },
                    { cognitoUserIdSave: cognitoUserId, isChat: 1 }
                ]
            })
            let notificationCognitoUserId = [];
            connectedList.forEach(connect => {
                let ignoreid;
                if (connect.cognitoUserIdSave == cognitoUserId) {
                    ignoreid = connect.cognitoUserId;
                }
                else {
                    ignoreid = connect.cognitoUserIdSave;
                }
                if (!notificationCognitoUserId.includes(ignoreid)) {
                    notificationCognitoUserId.push(ignoreid);
                }
            });

            if (notificationCognitoUserId.length > 0) {
                for (let i = 0; i < notificationCognitoUserId.length; i++) {
                    //save and sent notification
                    let firstname = "";
                    if (myProfile.fullName) {
                        firstname = myProfile.fullName.split(' ')[0]
                    }
                    let message = `${firstname} has opened up new time slots. Book a session before they fill up!`;
                    let type = `availability`;
                    let tableName = `availabilities`;
                    let isTakeAction = 0;
                    let notificationSave = await NotificationModel.create({
                        fromCognitoId: cognitoUserId,
                        toCognitoId: notificationCognitoUserId[i],
                        requestId: updatedAvailability._id,
                        tableName,
                        message: message,
                        type: type,
                        isTakeAction: isTakeAction,
                    });

                    //pushnotification

                    const userToNotification = await UsersModel.findOne(
                        { cognitoUserId: notificationCognitoUserId[i] }
                    );

                    if (userToNotification) {
                        if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                            let payload = {
                                notification: {
                                    title: "Request Accept",
                                    body: message,
                                    //data:notificationSave,
                                    content_available: "true",
                                    //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                                },
                                data: {
                                    "data": JSON.stringify(notificationSave),
                                }
                            }
                            await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                        }
                    }
                }

            }

            return res.json({ status: 1, message: 'Availability updated successfully', data: updatedAvailability });
        } catch (error) {

            return res.json({ status: 0, message: error.message });
        }
    },

    deleteAvailibilty: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;

        const { name, slottime } = req.body;

        try {

            const availability = await AvailabilityModel.findOne({ cognitoUserId });

            if (!availability) {
                return res.json({ status: 0, message: 'Availability not found for this user.' });
            }


            const slotIndex = availability.slots.findIndex(
                (slot) => slot.name === name
            );

            if (slotIndex === -1) {
                return res.json({ status: 0, message: 'Slot with the given name not found.' });
            }


            const timeIndex = availability.slots[slotIndex].slot.findIndex(
                (timeSlot) => timeSlot.time === slottime
            );

            if (timeIndex === -1) {
                return res.json({ status: 0, message: 'Slot time not found.' });
            }


            availability.slots[slotIndex].slot.splice(timeIndex, 1);


            if (availability.slots[slotIndex].slot.length === 0) {
                availability.slots.splice(slotIndex, 1);
            }


            const updatedAvailability = await availability.save();

            return res.json({
                status: 1,
                message: 'Slot removed successfully.',
                data: updatedAvailability
            });
        } catch (error) {
            console.error('Error deleting slot:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    deleteAvailibiltyForDay: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;

        const { name } = req.body;

        try {
            // Fetch the availability for the user
            const availability = await AvailabilityModel.findOne({ cognitoUserId });

            if (!availability) {
                return res.json({ status: 0, message: 'Availability not found for this user.' });
            }

            // Find the slot object with the given name
            //const slot = availability.slots.find((slot) => slot.name === name);

            // if (!slot) {
            //     return res.json({ status: 0, message: 'Slot with the given name not found.' });
            // }

            // Empty the slots for the given name
            //slot.slot = [];

            // Find the index of the slot with the given name
            const slotIndex = availability.slots.findIndex(
                (slot) => slot.name === name
            );

            if (slotIndex === -1) {
                return res.json({ status: 0, message: 'Slot with the given name not found.' });
            }
            // Remove the slot by name
            availability.slots.splice(slotIndex, 1);


            // Save the updated availability
            const updatedAvailability = await availability.save();





            return res.json({
                status: 1,
                message: `All slots under the name "${name}" have been removed successfully.`,
                data: updatedAvailability,
            });
        } catch (error) {
            console.error('Error deleting slots by name:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    myAvailibilty: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;



        try {

            // const availability = await AvailabilityModel.findOne({ cognitoUserId });
            // return res.json({
            //     status: 1,
            //     message: 'success.',
            //     data: availability
            // });
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format

            const availability = await AvailabilityModel.aggregate([
                { $match: { cognitoUserId } },
                {
                    $addFields: {
                        slots: {
                            $filter: {
                                input: '$slots',
                                as: 'slot',
                                cond: {
                                    $or: [
                                        { $eq: ['$$slot.type', 'day'] },
                                        {
                                            $and: [
                                                { $eq: ['$$slot.type', 'date'] },
                                                { $gte: ['$$slot.name', currentDate] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]);

            if (availability.length > 0) {
                return res.json({
                    status: 1,
                    message: 'success.',
                    data: availability[0]
                });
            } else {
                return res.json({
                    status: 1,
                    message: 'success.',
                    data: {slots:[]}
                });
            }
        } catch (error) {
            console.error('Error getting availabilty:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    getMatchingProfile: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;

        //const cognitoUserId = "73c478e2-f091-703a-cdf3-d1ed55eafe90";
        console.log("cognitoUserId", cognitoUserId);


        const { offset, limit } = req.body;

        try {

            const myProfile = await UsersModel.findOne({ cognitoUserId });

            if (!myProfile) {
                return res.status(200).json({
                    status: 0,
                    message: "User not found.",
                });
            }


            const myInterestNames = myProfile.interests.map((interest) => interest.name);
            //console.log("myInterestNames", myInterestNames);

            let ignoreCognitoUserId = [cognitoUserId];


            const savedUsers = await SavedProfilesModel.find({
                cognitoUserId: cognitoUserId, // Match documents with the given cognitoUserId
            });
            savedUsers.forEach(user => {
                if (user.cognitoUserIdSave && !ignoreCognitoUserId.includes(user.cognitoUserIdSave)) {
                    ignoreCognitoUserId.push(user.cognitoUserIdSave);
                }
            });


            const connectedList = await ConnectedUserModel.find({
                $or: [
                    { cognitoUserId: cognitoUserId },
                    { cognitoUserIdSave: cognitoUserId }
                ]
            })
            connectedList.forEach(connect => {
                let ignoreid;
                if (connect.cognitoUserIdSave == cognitoUserId) {
                    ignoreid = connect.cognitoUserId;
                }
                else {
                    ignoreid = connect.cognitoUserIdSave;
                }
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });


            const unconnectedList = await UnConnectedUserModel.find({
                cognitoUserId: cognitoUserId,
            })
            unconnectedList.forEach(connect => {
                let ignoreid = connect.cognitoUserIdSave;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });

            const blockedUsersList = await BlockedUsers.find({
                cognitoUserId: cognitoUserId,
                status:1
            })
            blockedUsersList.forEach(block => {
                let ignoreid = block.blockedUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            
            const InactiveUsersList = await UsersModel.find(
                { isActive: 0 }, 
                { cognitoUserId: 1, _id: 0 }
            );
            InactiveUsersList.forEach(block => {
                let ignoreid = block.cognitoUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });

            //console.log("ignoreCognitoUserId_3",ignoreCognitoUserId);


            const users = await UsersModel.find({
                "interests.name": { $in: myInterestNames },
                cognitoUserId: { $nin: ignoreCognitoUserId },
                userType: { $ne: myProfile.userType },
            }).lean();


            const matchedUsers = await Promise.all(
                users.map(async (user) => {
                    const matchingInterests = user.interests.filter((interest) =>
                        myInterestNames.includes(interest.name)
                    );

                    // Calculate match percentage, handle empty myInterestNames
                    const matchPercentage = myInterestNames.length > 0
                        ? Math.round((matchingInterests.length / myInterestNames.length) * 100)
                        : 0;

                    // Check if user is saved
                    const checkSaved = await SavedProfilesModel.findOne({
                        cognitoUserId: cognitoUserId,
                        cognitoUserIdSave: user.cognitoUserId, // Adjusted to check the current user's cognitoUserId
                    });

                    const isSaved = checkSaved ? true : false;

                    const connectedData = await ConnectedUserModel.findOne({
                        $or: [
                            { cognitoUserId: user.cognitoUserId, cognitoUserIdSave: cognitoUserId },
                            { cognitoUserId: cognitoUserId, cognitoUserIdSave: user.cognitoUserId },
                        ]
                    });
                    const isRequestSent = connectedData ? 1 : 0;
                    const isMeetingEnable = connectedData?.status || 0;
                    const rating = await getUserRating({ cognitoUserIdMy: user.cognitoUserId });

                    return {
                        ...user,
                        matchPercentage,
                        isSaved,
                        isRequestSent,
                        isMeetingEnable,
                        rating,
                    };
                })
            );

            // Sort users by descending match percentage
            matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);

            const offsetstart = parseInt(offset) || 0;
            //const limits = parseInt(process.env.PAGINATION_LIMIT) || 10;
            const limits = parseInt(limit) || 10;


            const paginatedUsers = matchedUsers.slice(offsetstart, offsetstart + limits);

            return res.json({
                status: 1,
                message: "Matched users fetched successfully.",
                totalCount: matchedUsers.length,
                data: paginatedUsers,

            });


        } catch (error) {
            console.error('Error getting:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    saveProfile: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;



        const { cognitoUserIdSave, status } = req.body;

        try {

            const myProfile = await UsersModel.findOne({ cognitoUserId });

            if (!myProfile) {
                return res.status(200).json({
                    status: 0,
                    message: "User not found.",
                });
            }

            if (!cognitoUserIdSave) {
                return res.status(200).json({
                    status: 0,
                    message: "cognitoUserIdSave is required",
                });
            }
            if (cognitoUserId === cognitoUserIdSave) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }

            const cognitoUserIdSaveProfile = await UsersModel.findOne({ cognitoUserId: cognitoUserIdSave });

            if (!cognitoUserIdSaveProfile) {
                return res.status(200).json({
                    status: 0,
                    message: "Saved User not found.",
                });
            }

            // Check if the profile is already saved
            const existingEntry = await SavedProfilesModel.findOne({
                cognitoUserId: cognitoUserId,
                cognitoUserIdSave: cognitoUserIdSave,
            });

            if (status === "1") {
                if (existingEntry) {
                    return res.status(200).json({
                        status: 0,
                        message: "Profile already saved.",
                    });
                }
                // Save profile to the SavedProfiles table
                await SavedProfilesModel.create({
                    cognitoUserId: cognitoUserId,
                    cognitoUserIdSave: cognitoUserIdSave,
                });

                return res.status(200).json({
                    status: 1,
                    message: "Profile saved successfully.",
                });
            }
            else if (status === "0") {
                if (!existingEntry) {
                    return res.status(200).json({
                        status: 0,
                        message: "Profile not found in saved list.",
                    });
                }
                // Remove profile from the SavedProfiles table
                await SavedProfilesModel.deleteOne({
                    cognitoUserId: cognitoUserId,
                    cognitoUserIdSave: cognitoUserIdSave,
                });

                return res.status(200).json({
                    status: 1,
                    message: "Profile unsaved successfully.",
                });
            }
            else {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid status. Use '1' or '0'.",
                });
            }




        } catch (error) {
            console.error('Error getting:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    getSavedProfile: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserId = decoded.username;
        console.log("cognitoUserId",cognitoUserId);

        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;

        try {

            const myProfile = await UsersModel.findOne({ cognitoUserId });


            if (!myProfile) {
                return res.status(200).json({
                    status: 0,
                    message: "User not found.",
                });
            }
            const myInterestNames = myProfile.interests.map((interest) => interest.name);
            // console.log("myInterestNames",myInterestNames);

            let ignoreCognitoUserId = [cognitoUserId];
            const blockedUsersList = await BlockedUsers.find({
                cognitoUserId: cognitoUserId,
                status:1
            })
            blockedUsersList.forEach(block => {
                let ignoreid = block.blockedUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });

            const InactiveUsersList = await UsersModel.find(
                { isActive: 0 }, 
                { cognitoUserId: 1, _id: 0 }
            );
            InactiveUsersList.forEach(block => {
                let ignoreid = block.cognitoUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            const UnconnectedUsersList = await UnConnectedUserModel.find({
                cognitoUserId: cognitoUserId,
            })
            UnconnectedUsersList.forEach(unconnect => {
                let ignoreid = unconnect.cognitoUserIdSave;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });

            console.log("ignoreCognitoUserId",ignoreCognitoUserId);


            // Get the saved profiles with offset and limit
            const savedProfileList = await SavedProfilesModel.find({ cognitoUserId, cognitoUserIdSave: { $nin: ignoreCognitoUserId } })
                .skip(offsetstart)
                .limit(limit)
                .lean();

            // Fetch user details for each saved profile
            const savedProfileListUsers = await Promise.all(savedProfileList.map(async (user) => {
                const saveProfile = await UsersModel.findOne({ cognitoUserId: user.cognitoUserIdSave }).lean();
                //console.log("saveProfileinterest",saveProfile.interests);
                const matchingInterests = saveProfile.interests.filter((interest) =>
                    myInterestNames.includes(interest.name)
                );

                // Calculate match percentage, handle empty myInterestNames
                const matchPercentage = myInterestNames.length > 0
                    ? Math.round((matchingInterests.length / myInterestNames.length) * 100)
                    : 0;

                saveProfile.matchPercentage = matchPercentage;
                const connectedData = await ConnectedUserModel.findOne({
                    $or: [
                        { cognitoUserId: user.cognitoUserId, cognitoUserIdSave: cognitoUserId },
                        { cognitoUserId: cognitoUserId, cognitoUserIdSave: user.cognitoUserId },
                    ]
                });
                const isRequestSent = connectedData ? 1 : 0;
                const isMeetingEnable = connectedData?.status || 0;
                const rating = await getUserRating({ cognitoUserIdMy: user.cognitoUserId });
                
                // Check if user is saved
                const checkSaved = await SavedProfilesModel.findOne({
                    cognitoUserId: cognitoUserId,
                    cognitoUserIdSave: user.cognitoUserIdSave, // Adjusted to check the current user's cognitoUserId
                });

                const isSaved = checkSaved ? true : false;



                return {
                    ...user,
                    cognitoUserIdSave: saveProfile,
                    isRequestSent:isRequestSent,
                    isMeetingEnable:isMeetingEnable,
                    rating,
                    isSaved,
                };
            }));

            return res.json({
                status: 1,
                message: "Saved users fetched successfully.",
                data: savedProfileListUsers,
            });


        } catch (error) {
            console.error('Error getting:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    getUserProfile: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]; // Extract token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        //console.log("decoded",decoded);
        const cognitoUserIdMy = decoded.username; // Get user ID from token

        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId } = req.body;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            if (!cognitoUserId) {
                return res.status(200).json({
                    status: 0,
                    message: "cognitoUserId is required",
                });
            }
            //console.log("myProfile",myProfile);
            const myInterestNames = myProfile.interests.map((interest) => interest.name);
            //console.log("myInterestNames",myInterestNames);

            const users = await UsersModel.find({
                // "interests.name": { $in: myInterestNames },
                cognitoUserId,
                //userType: { $ne: myProfile.userType },
            }).lean();


            const matchedUsers = await Promise.all(
                users.map(async (user) => {
                    const matchingInterests = user.interests.filter((interest) =>
                        myInterestNames.includes(interest.name)
                    );

                    // Calculate match percentage, handle empty myInterestNames
                    const matchPercentage = myInterestNames.length > 0
                        ? Math.round((matchingInterests.length / myInterestNames.length) * 100)
                        : 0;

                    // Check if user is saved
                    const checkSaved = await SavedProfilesModel.findOne({
                        cognitoUserId: cognitoUserIdMy,
                        cognitoUserIdSave: user.cognitoUserId, // Adjusted to check the current user's cognitoUserId
                    });

                    const isSaved = checkSaved ? true : false;

                    const rating = await getUserRating({ cognitoUserIdMy: user.cognitoUserId });


                    return {
                        ...user,
                        matchPercentage, // Match percentage
                        isSaved, // Whether the user is saved
                        rating
                    };
                })
            );

            //res.status(200).json(profile);
            return res.json({ status: 1, message: 'Profile details', data: matchedUsers });
        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    sendUnConnectRequest: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;

        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId } = req.body;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            if (!cognitoUserId) {
                return res.status(200).json({
                    status: 0,
                    message: "cognitoUserId is required",
                });
            }

            // Check if already sent request
            const checkRequest = await UnConnectedUserModel.findOne({
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdSave: cognitoUserId,
            });

            if (checkRequest) {
                return res.status(200).json({
                    status: 0,
                    message: "You have already unconnect this user",
                });
            }
            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }


            const requestUser = await UnConnectedUserModel.create({
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdSave: cognitoUserId,
            });

            //sent notification



            return res.status(200).json({
                status: 1,
                message: "This profile has been removed from your recommendations. You won’t see this profile again.",
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    sendConnectRequest: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;

        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId } = req.body;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            if (!cognitoUserId) {
                return res.status(200).json({
                    status: 0,
                    message: "cognitoUserId is required",
                });
            }

            const cognitoUserIdProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!cognitoUserIdProfile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            // Check if already sent request
            const checkRequest = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId },
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                ]
            });
            // const checkRequest = await ConnectedUserModel.findOne({
            //     cognitoUserId: cognitoUserIdMy,
            //     cognitoUserIdSave: cognitoUserId,
            //     status: { $in: [0, 1] },
            // });
            let messagerequest = "You have already sent a connection request to this profile";
            if(checkRequest?.status == 1)
            {
                let firstname = "";
                if (cognitoUserIdProfile.fullName) {
                    firstname = cognitoUserIdProfile.fullName.split(' ')[0]
                }
                messagerequest = `You’re already connected with ${firstname}.`;
            }
            else if(checkRequest?.cognitoUserId == cognitoUserIdMy)
            {
                messagerequest = "You have already sent a connection request to this profile";
            }
            else if(checkRequest?.cognitoUserIdSave == cognitoUserIdMy)
            {
                messagerequest = "You have a pending connection request in your notifications waiting for acceptance.";
            }

            if (checkRequest) {
                return res.status(200).json({
                    status: 0,
                    message: messagerequest,
                });
            }
            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }


            const requestUser = await ConnectedUserModel.create({
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdSave: cognitoUserId,
            });

            //save and sent notification
            let message = `${myProfile.fullName} wants to connect with you`;
            let type = `connect`;
            let tableName = `connected_users`;
            let isTakeAction = 0;
            let notificationSave = await NotificationModel.create({
                fromCognitoId: cognitoUserIdMy,
                toCognitoId: cognitoUserId,
                requestId: requestUser._id,
                tableName,
                message: message,
                type: type,
                isTakeAction: isTakeAction,
            });

            //pushnotification
            if (Array.isArray(cognitoUserIdProfile.deviceToken) && cognitoUserIdProfile.deviceToken.length > 0) {
                let payload = {
                    notification: {
                        title: "Connection Request",
                        body: message,
                        //data:notificationSave,
                        content_available: "true",
                        //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                    },
                    data: {
                        "data": JSON.stringify(notificationSave),
                    }
                }
                await PushNotification({ registrationToken: cognitoUserIdProfile.deviceToken, payload });
            }



    




            return res.status(200).json({
                status: 1,
                message: "Your request has been sent successfully. Once it is accepted, you will be able to start chatting. Thank you for your patience!",
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getNotifications: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;


        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const notificationList = await NotificationModel.find({ toCognitoId: cognitoUserIdMy })
                .sort({ updatedAt: -1 })
                .skip(offsetstart)
                .limit(limit)
                .lean();

            const notifications = await Promise.all(
                notificationList.map(async (notify) => {

                    // single user detail
                    const [fromUserDetail] = await UsersModel.aggregate([
                        {
                            $match: { cognitoUserId: notify.fromCognitoId }
                        },
                        {
                            $project: {
                                cognitoUserId: 1,
                                email: 1,
                                userType: 1,
                                fullName: { $ifNull: ["$fullName", ""] },
                                profilePic: { $ifNull: ["$profilePic", ""] }
                            }
                        }
                    ]);

                    const connectedData = await ConnectedUserModel.findOne({
                        $or: [
                            { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: notify.fromCognitoId },
                            { cognitoUserId: notify.fromCognitoId, cognitoUserIdSave: cognitoUserIdMy },
                        ]
                    });
                    const startConversation = connectedData ? connectedData.startConversation : [];




                    return {
                        ...notify,
                        startConversation,
                        fromUserDetail
                    };
                })
            );


            return res.status(200).json({
                status: 1,
                message: "Notifications list.",
                data: notifications
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    acceptDeclineConnectRequest: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;


        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { requestId, notificationId, status } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            if (!requestId || !status) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            // Validate requestId
            if (!mongoose.Types.ObjectId.isValid(requestId)) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid requestId format",
                });
            }
            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            // Check requestId valid
            const checkRequest = await ConnectedUserModel.findOne({
                _id: requestId,
                cognitoUserIdSave: cognitoUserIdMy,
                status: 0,
            });

            if (!checkRequest) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid request",
                });
            }

            if (status == '1' || status == '2') {
                const filter = { _id: requestId };
                let update = {};
                update.status = status;
                const profile = await ConnectedUserModel.findOneAndUpdate(filter, { $set: update }, { new: true });

                // notification table update
                const filters = { _id: notificationId };
                // let updates = {}; 
                // updates.isTakeAction = 1;
                // await NotificationModel.findOneAndUpdate(filters, { $set: updates }, { new: true });
                await NotificationModel.deleteOne(filters);

                if (status == "2") {
                    await ConnectedUserModel.deleteOne(filter);
                }







                //sent notification
                if (status == '1') {

                    let firstname = "";
                    if (myProfile.fullName) {
                        firstname = myProfile.fullName.split(' ')[0]
                    }

                    let message = `You and ${firstname} just connected—start chatting and set up your first session!`;
                    let type = `connect`;
                    let tableName = `connected_users`;
                    let notificationSave = await NotificationModel.create({
                        fromCognitoId: cognitoUserIdMy,
                        toCognitoId: checkRequest.cognitoUserId,
                        requestId: requestId,
                        tableName,
                        message: message,
                        type: type,
                        isTakeAction: 1,
                    });



                    //pushnotification

                    const userToNotification = await UsersModel.findOne(
                        { cognitoUserId: checkRequest.cognitoUserId }
                    );

                    console.log("userToNotification", userToNotification);

                    if (userToNotification) {
                        if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                            let payload = {
                                notification: {
                                    title: "Request Accept",
                                    body: message,
                                    //data:notificationSave,
                                    content_available: "true",
                                    //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                                },
                                data: {
                                    "data": JSON.stringify(notificationSave),
                                }
                            }
                            await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                        }
                    }

                }


                return res.status(200).json({
                    status: 1,
                    message: "Request updated successfully.",
                });
            }
            else {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid status",
                });
            }







        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    recentMatches: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            const myInterestNames = myProfile.interests.map((interest) => interest.name);
            const ignoreCognitoUserId = [cognitoUserIdMy];
            const blockedUsersList = await BlockedUsers.find({
                cognitoUserId: cognitoUserIdMy,
                status:1
            })
            blockedUsersList.forEach(block => {
                let ignoreid = block.blockedUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            const InactiveUsersList = await UsersModel.find(
                { isActive: 0 }, 
                { cognitoUserId: 1, _id: 0 }
            );
            InactiveUsersList.forEach(block => {
                let ignoreid = block.cognitoUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            const connectedList = await ConnectedUserModel.find({
                $or: [
                    { cognitoUserId: cognitoUserIdMy, status: 0,cognitoUserIdSave: { $nin: ignoreCognitoUserId } },
                    { cognitoUserIdSave: cognitoUserIdMy, status: 0,cognitoUserId: { $nin: ignoreCognitoUserId } }
                ]
            })
                .sort({ updatedAt: -1 })
                .skip(offsetstart)
                .limit(limit)
                .lean();

            const recentMatchesList = await Promise.all(
                connectedList.map(async (connect) => {
                    let filters = {};
                    let secondUser = "";
                    if (connect.cognitoUserId == cognitoUserIdMy) {
                        filters.cognitoUserId = connect.cognitoUserIdSave;
                        secondUser = connect.cognitoUserIdSave;
                    }
                    else {
                        filters.cognitoUserId = connect.cognitoUserId;
                        secondUser = connect.cognitoUserId;
                    }

                    // single user detail
                    const [connectUserDetail] = await UsersModel.aggregate([
                        {
                            $match: filters
                        },
                        {
                            $project: {
                                // cognitoUserId: 1,
                                // email: 1,
                                // userType: 1,
                                // fullName: { $ifNull: ["$fullName", ""] },
                                // profilePic: { $ifNull: ["$profilePic", ""] }
                                deviceToken: 0,

                            }
                        }
                    ]);

                    const matchingInterests = connectUserDetail.interests.filter((interest) =>
                        myInterestNames.includes(interest.name)
                    );

                    // Calculate match percentage, handle empty myInterestNames
                    const matchPercentage = myInterestNames.length > 0
                        ? Math.round((matchingInterests.length / myInterestNames.length) * 100)
                        : 0;

                    // Check if user start chat

                    const checkChat = await ChatModel.findOne({
                        $or: [
                            { fromId: cognitoUserIdMy, toId: secondUser, messageType: 0 },
                            { toId: cognitoUserIdMy, fromId: secondUser, messageType: 0 },
                        ]
                    })
                        .sort({ updatedAt: -1 });

                    const isChat = checkChat ? 1 : 0;
                    const lastMessage = checkChat ? checkChat.message : "";

                    const connectedData = await ConnectedUserModel.findOne({
                        $or: [
                            { cognitoUserId: secondUser, cognitoUserIdSave: cognitoUserIdMy },
                            { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: secondUser },
                        ]
                    });
                    const isRequestSent = connectedData ? 1 : 0;
                    const isMeetingEnable = connectedData?.status || 0;
                    const rating = await getUserRating({ cognitoUserIdMy: secondUser });

                    return {
                        ...connect,
                        connectUserDetail: {
                            ...connectUserDetail,
                            matchPercentage
                        },
                        isChat,
                        lastMessage,
                        isRequestSent,
                        isMeetingEnable,
                        rating,
                    };
                })
            );



            return res.status(200).json({
                status: 1,
                message: "Recent matches",
                data: recentMatchesList,
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getNewCoversations: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const connectedList = await ConnectedUserModel.find({
                $or: [
                    { cognitoUserId: cognitoUserIdMy, status: 1, isChat: 0 },
                    { cognitoUserIdSave: cognitoUserIdMy, status: 1, isChat: 0 }
                ]
            })
                .sort({ updatedAt: -1 })
                //.skip(offsetstart)
                //.limit(limit)
                .lean();

            const recentMatchesList = await Promise.all(
                connectedList.map(async (connect) => {
                    let filters = {};
                    let secondUser = "";
                    if (connect.cognitoUserId == cognitoUserIdMy) {
                        filters.cognitoUserId = connect.cognitoUserIdSave;
                        secondUser = connect.cognitoUserIdSave;
                    }
                    else {
                        filters.cognitoUserId = connect.cognitoUserId;
                        secondUser = connect.cognitoUserId;
                    }

                    // single user detail
                    const [connectUserDetail] = await UsersModel.aggregate([
                        {
                            $match: filters
                        },
                        {
                            $project: {
                                cognitoUserId: 1,
                                email: 1,
                                userType: 1,
                                fullName: { $ifNull: ["$fullName", ""] },
                                profilePic: { $ifNull: ["$profilePic", ""] }
                            }
                        }
                    ]);

                    // Check if user start chat

                    const checkChat = await ChatModel.findOne({
                        $or: [
                            { fromId: cognitoUserIdMy, toId: secondUser },
                            { toId: cognitoUserIdMy, fromId: secondUser },
                        ]
                    })
                        .sort({ updatedAt: -1 });

                    const isChat = checkChat ? 1 : 0;
                    let firstName = "";
                    if (connectUserDetail.fullName) {
                        firstName = connectUserDetail.fullName.split(' ')[0];
                    }

                    const lastMessage = checkChat ? checkChat.message : `${firstName} has accepted your connection request. Say hello 👋`;
                    const lastMessagetime = checkChat ? checkChat.createdAt : connect.createdAt;

                    return {
                        ...connect,
                        connectUserDetail,
                        isChat,
                        lastMessage,
                        lastMessagetime
                    };
                })
            );

            // Separate the conversations into two arrays
            //const newConversations = recentMatchesList.filter((item) => item.isChat === 0);
            //const oldConversations = recentMatchesList.filter((item) => item.isChat === 1);

            // Filter conversations based on type

            // Apply offset and limit after filtering


            return res.status(200).json({
                status: 1,
                message: "Recent conversations",
                // data: {
                //     newConversations,
                //     oldConversations,
                // },
                data: recentMatchesList,
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getOldConversations: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const connectedList = await ConnectedUserModel.find({
                $or: [
                    // { cognitoUserId: cognitoUserIdMy, status: 1, isChat: 1 },
                    // { cognitoUserIdSave: cognitoUserIdMy, status: 1, isChat: 1 }
                    { cognitoUserId: cognitoUserIdMy, status: 1 },
                    { cognitoUserIdSave: cognitoUserIdMy, status: 1 }
                ]
            })
                .sort({ updatedAt: -1 })
                .skip(offsetstart)
                .limit(limit)
                .lean();

            const recentMatchesList = await Promise.all(
                connectedList.map(async (connect) => {
                    let filters = {};
                    let secondUser = "";
                    if (connect.cognitoUserId == cognitoUserIdMy) {
                        filters.cognitoUserId = connect.cognitoUserIdSave;
                        secondUser = connect.cognitoUserIdSave;
                    }
                    else {
                        filters.cognitoUserId = connect.cognitoUserId;
                        secondUser = connect.cognitoUserId;
                    }

                    // single user detail
                    const [connectUserDetail] = await UsersModel.aggregate([
                        {
                            $match: filters
                        },
                        {
                            $project: {
                                cognitoUserId: 1,
                                email: 1,
                                userType: 1,
                                emailDomainVerified: 1,
                                fullName: { $ifNull: ["$fullName", ""] },
                                profilePic: { $ifNull: ["$profilePic", ""] }
                            }
                        }
                    ]);

                    // Check if user start chat

                    const checkChat = await ChatModel.findOne({
                        $or: [
                            { fromId: cognitoUserIdMy, toId: secondUser, messageType: 0 },
                            { toId: cognitoUserIdMy, fromId: secondUser, messageType: 0 },
                        ]
                        // $or: [
                        //     { fromId: cognitoUserIdMy, toId: secondUser },
                        //     { toId: cognitoUserIdMy, fromId: secondUser },
                        // ]
                    })
                        .sort({ updatedAt: -1 });
                    //console.log("checkChat",checkChat);

                    const isChat = checkChat ? 1 : 0;
                    let firstName = "";
                    if (connectUserDetail.fullName) {
                        firstName = connectUserDetail.fullName.split(' ')[0];
                    }

                    const lastMessage = checkChat ? checkChat.message : `${firstName} has accepted your connection request. Say hello 👋`;
                    const lastMessagetime = checkChat ? checkChat.createdAt : connect.createdAt;


                    return {
                        ...connect,
                        connectUserDetail,
                        isChat,
                        lastMessage,
                        lastMessagetime
                    };
                })
            );

            // Separate the conversations into two arrays
            //const newConversations = recentMatchesList.filter((item) => item.isChat === 0);
            //const oldConversations = recentMatchesList.filter((item) => item.isChat === 1);

            // Filter conversations based on type

            // Apply offset and limit after filtering


            return res.status(200).json({
                status: 1,
                message: "Recent conversations",
                // data: {
                //     newConversations,
                //     oldConversations,
                // },
                data: recentMatchesList,
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    sendMessage: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90";


        console.log("cognitoUserIdMy", cognitoUserIdMy);


        const { cognitoUserId, message } = req.body;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            if (!cognitoUserId || !message) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            //console.log("myProfile",myProfile);

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }

            //    const connectedList = await ConnectedUserModel.find({
            //         $or: [
            //         { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId, status: 1 },
            //         { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy, status: 1 },
            //         ]
            //     });

            //     console.log("connectedList",connectedList);

            //     if(connectedList.length < 1)
            //     {
            //         return res.status(200).json({
            //             status: 0,
            //             message: "You are not connected with other user",
            //         });
            //     }
            const checkConnectedUser = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy, status: 1 },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId, status: 1 }
                ]
            })
            if (!checkConnectedUser) return res.json({ status: 0, message: "Both users are not connected" });



            const saveChat = await ChatModel.create({
                fromId: cognitoUserIdMy,
                toId: cognitoUserId,
                connectedId: checkConnectedUser._id,
                message,
            });


            let update = {
                isChat: 1,
                startConversation: checkConnectedUser.startConversation || []
            };


            const idsToCheck = [cognitoUserId, cognitoUserIdMy];
            //console.log("idsToCheck", idsToCheck);

            idsToCheck.forEach((id) => {
                if (!update.startConversation.includes(id)) {
                    update.startConversation.push(id);
                }
            });

            const filter = {
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId }
                ]
            };
            //update.startConversationcognitoUserId = 1;
            //update.startConversationcognitoUserIdSave = 1;
            const connectedUpdated = await ConnectedUserModel.findOneAndUpdate(filter, { $set: update }, { new: true });


            // Send message privately to the receiver
            console.log("connectedUsers", connectedUsers);
            const receiverSocketId = connectedUsers[cognitoUserId];
            console.log("receiverSocketId", receiverSocketId);
            // if (receiverSocketId) {
            //     io.to(receiverSocketId).emit("sendMessage", {
            //         status: 1,
            //         sendercognitoUserId: cognitoUserIdMy,
            //         receivercognitoUserId: cognitoUserId,
            //         profilePic: myProfile.profilePic,
            //         message,
            //         updatedAt: saveChat.updatedAt
            //     });
            // }
            // send message using socket
            io.emit("sendMessage", {
                status: 1,
                _id: saveChat._id,
                connectedId: checkConnectedUser._id,
                sendercognitoUserId: cognitoUserIdMy,
                receivercognitoUserId: cognitoUserId,
                profilePic: myProfile.profilePic,
                message: message,
                isEdit: 0,
                updatedAt: saveChat.createdAt
            });

            //pushnotification
            // if (Array.isArray(myProfile.deviceToken) && myProfile.deviceToken.length > 0)
            // {
            //     let payload = { 
            //     notification : {
            //     title : "Connection Request",
            //     body : message,
            //     //data:saveChat,
            //     content_available : "true",
            //     //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
            //     },
            //     data:{
            //         "data":JSON.stringify(saveChat),
            //     }
            //     }
            //     await PushNotification({registrationToken:myProfile.deviceToken,payload});
            // }


            return res.status(200).json({
                status: 1,
                message: "Message sent successfully",
                data:saveChat
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },
    editMessage: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90";


        console.log("cognitoUserIdMy", cognitoUserIdMy);


        const { messageId, message } = req.body;
        //console.log("cognitoUserId",cognitoUserId);
        try {

            if (!messageId || !message) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            //console.log("myProfile",myProfile);

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const chatDetail = await ChatModel.findOne(
                { _id: messageId },
            );
            if (!chatDetail) return res.json({ status: 0, message: "Invalid messageId" });

            const checkConnectedUser = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: chatDetail.toId, cognitoUserIdSave: cognitoUserIdMy, status: 1 },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: chatDetail.toId, status: 1 }
                ]
            })
            if (!checkConnectedUser) return res.json({ status: 0, message: "Both users are not connected" });

            let update = {
                message: message,
                isEdit: 1,
            };
            const filter = { _id: messageId};
            const connectedUpdated = await ChatModel.findOneAndUpdate(filter, { $set: update }, { new: true });
            


            
            // send message using socket
            io.emit("sendMessage", {
                status: 1,
                _id: connectedUpdated._id,
                connectedId: checkConnectedUser._id,
                sendercognitoUserId: cognitoUserIdMy,
                receivercognitoUserId: chatDetail.toId,
                profilePic: myProfile.profilePic,
                message: message,
                isEdit: 1,
                updatedAt: connectedUpdated.createdAt
            });

            


            return res.status(200).json({
                status: 1,
                message: "Message updated successfully",
                data:connectedUpdated
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getChatSingleUser: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;



        //console.log("cognitoUserIdMy",cognitoUserIdMy);

        const { cognitoUserId, offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;
        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    emailDomainVerified: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    emailDomainVerified: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });



            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }

            const messageTypeCondition = myProfile.userType === 0 ? { messageType: { $ne: 1 } } : {};

            const ChatData = await ChatModel.find({
                $or: [
                    { fromId: cognitoUserIdMy, toId: cognitoUserId, ...messageTypeCondition },
                    { fromId: cognitoUserId, toId: cognitoUserIdMy, ...messageTypeCondition },
                ]
            })
                .sort({ createdAt: -1 })
                .skip(offsetstart)
                .limit(limit)
                .lean();



            const connectedData = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId, status: 1 },
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy, status: 1 },
                ]
            });
            const isMeetingEnable = connectedData ? connectedData.isMeetingEnable : 0;

            const rating = await getUserRating({ cognitoUserIdMy: cognitoUserId });
            const profileWithRating = {
                ...profile.toObject(),
                rating,
                isMeetingEnable
            };

            const ChatList = await Promise.all(
                ChatData.map(async (chat) => {
                    let fromIdDetail = {};
                    let toIdDetail = {};

                    if (chat.fromId == cognitoUserIdMy) {
                        fromIdDetail = myProfile;
                        toIdDetail = profile;
                    }
                    else {
                        fromIdDetail = profile;
                        toIdDetail = myProfile;
                    }

                    let meetingNote = "";
                    if (chat.meetingId && chat.messageType == 1) {
                        let checkBooking = await BookMeetingsModel.findOne({
                            _id: chat.meetingId
                        });

                        meetingNote = checkBooking ? checkBooking.personalNote : "";
                    }


                    return {
                        ...chat,
                        fromIdDetail,
                        toIdDetail,
                        meetingNote

                    };
                })
            );


            return res.status(200).json({
                status: 1,
                message: "Chat list",
                data: {
                    ChatList,
                    profile: profileWithRating,
                },
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    enableMeeting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;




        //console.log("cognitoUserIdMy",cognitoUserIdMy);

        const { cognitoUserId } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            //console.log("myProfile",myProfile);
            if (myProfile.userType == 0) {
                return res.status(200).json({
                    status: 0,
                    message: "Only Menter can enable meeting",
                });
            }

            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }



            const connectedData = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId, status: 1 },
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy, status: 1 },
                ]
            });

            if (!connectedData) {
                return res.status(200).json({
                    status: 0,
                    message: "No connection found",
                });
            }

            if (connectedData.isMeetingEnable == 1) {
                return res.status(200).json({
                    status: 0,
                    message: "Meeting request already enabled",
                });
            }

            connectedData.isMeetingEnable = 1;
            connectedData.save();

            //save Notification

            let message = `${myProfile.fullName} has enabled meeting request`;
            let type = `connect`;
            let tableName = `connected_users`;
            let notificationSave = await NotificationModel.create({
                fromCognitoId: cognitoUserIdMy,
                toCognitoId: cognitoUserId,
                requestId: connectedData._id,
                tableName,
                message: message,
                type: type,
                isTakeAction: 1,
            });

            //pushnotification

            const userToNotification = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }
            );

            if (userToNotification) {
                if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "Enable Meeting",
                            body: message,
                            //data:notificationSave,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                }
            }


           


            // send message using socket
            io.emit("enableMeeting", {
                status: 1,
                connectedId: connectedData._id,
                sendercognitoUserId: cognitoUserIdMy,
                receivercognitoUserId: cognitoUserId,
                profilePic: myProfile.profilePic,
                message: message,
                updatedAt: connectedData.updatedAt
            });



            return res.status(200).json({
                status: 1,
                message: "Enable meeting request successfully",
                data: connectedData
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    searchUser: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;




        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { search, filter, offset } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const myInterestNames = myProfile.interests.map((interest) => interest.name);

            const ignoreCognitoUserId = [cognitoUserIdMy];
            const blockedUsersList = await BlockedUsers.find({
                cognitoUserId: cognitoUserIdMy,
                status:1
            })
            blockedUsersList.forEach(block => {
                let ignoreid = block.blockedUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            const InactiveUsersList = await UsersModel.find(
                { isActive: 0 }, 
                { cognitoUserId: 1, _id: 0 }
            );
            InactiveUsersList.forEach(block => {
                let ignoreid = block.cognitoUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            
            const UnconnectedUsersList = await UnConnectedUserModel.find({
                cognitoUserId: cognitoUserIdMy,
            })
            UnconnectedUsersList.forEach(unconnect => {
                let ignoreid = unconnect.cognitoUserIdSave;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });

            const finddata = {};
            finddata.cognitoUserId = { $nin: ignoreCognitoUserId };
            finddata.userType = { $ne: myProfile.userType };
            finddata.isCreateProfile = { $ne: 0 };


            if (search) {
                finddata.$or = [
                    { fullName: { $regex: search, $options: "i" } },
                    //{ location: { $regex: search, $options: "i" } },
                    //{ "interests.name": { $regex: search, $options: "i" } }
                ];
            }


            if (filter && Array.isArray(filter) && filter.length > 0) {
                finddata.interests = {
                    $elemMatch: {
                        interestId: { $in: filter },
                    },
                };
            }

            //console.log("finddata",finddata);

            const users = await UsersModel.find(finddata).lean();

            //console.log("usersusers",users);


            const matchedUsers = await Promise.all(
                users.map(async (user) => {
                    const matchingInterests = user.interests.filter((interest) =>
                        myInterestNames.includes(interest.name)
                    );

                    // Calculate match percentage, handle empty myInterestNames
                    const matchPercentage = myInterestNames.length > 0
                        ? Math.round((matchingInterests.length / myInterestNames.length) * 100)
                        : 0;

                    // Check if user is saved
                    const checkSaved = await SavedProfilesModel.findOne({
                        cognitoUserId: cognitoUserIdMy,
                        cognitoUserIdSave: user.cognitoUserId, // Adjusted to check the current user's cognitoUserId
                    });

                    const isSaved = checkSaved ? true : false;
                    const connectedData = await ConnectedUserModel.findOne({
                        $or: [
                            { cognitoUserId: user.cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                            { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: user.cognitoUserId },
                        ]
                    });
                    const isRequestSent = connectedData ? 1 : 0;
                    const isMeetingEnable = connectedData?.status || 0;
                    const rating = await getUserRating({ cognitoUserIdMy: user.cognitoUserId });

                    return {
                        ...user,
                        matchPercentage, 
                        isSaved, 
                        isRequestSent, 
                        isMeetingEnable,
                        rating, 
                    };
                })
            );

            // Sort users by descending match percentage
            matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);

            const offsetstart = parseInt(offset) || 0;
            const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;


            const paginatedUsers = matchedUsers.slice(offsetstart, offsetstart + limit);

            return res.json({
                status: 1,
                message: "Matched users fetched successfully.",
                totalCount: matchedUsers.length,
                data: paginatedUsers,

            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    getAvailableSlots: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90"; 



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId, date } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId || !date) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            // Convert the input date string to a Date object
            const dateObj = new Date(date);

            // Use Intl.DateTimeFormat to get the weekday
            const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);



            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    communicationPreferences: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });


            let slotNames = [dayOfWeek, date];
            console.log("slotNames", slotNames);
            let availabilityData = await AvailabilityModel.aggregate([
                {
                    $match: {
                        cognitoUserId: cognitoUserId,
                        "slots.name": { $in: slotNames },
                    },
                },
                {
                    $project: {
                        slots: {
                            $filter: {
                                input: "$slots",
                                as: "slot",
                                cond: {
                                    $and: [
                                        { $in: ["$$slot.name", slotNames] },  // Match the slot name
                                        { $eq: ["$$slot.status", 1] }  // Check if status is 1
                                    ]
                                },
                            },
                        },
                    },
                },
            ]);
            //console.log("availabilityData",availabilityData);
            availabilityData.forEach((availability) => {
                let daySlotsMap = new Map();

                // Step 1: Store all 'day' slots in a Map for easy merging
                availability.slots.forEach((slot) => {
                    if (slot.type === "day") {
                        daySlotsMap.set(slot.name, slot);
                    }
                });

                // Step 2: Merge 'date' slots into the corresponding 'day' slots
                availability.slots.forEach((slot) => {
                    if (slot.type === "date") {
                        let daySlot = daySlotsMap.get(dayOfWeek); // Change logic if needed for dynamic day mapping
                        if (daySlot) {
                            daySlot.slot.push(...slot.slot);
                        } else {
                            // If there's no existing day slot, create a new entry
                            daySlotsMap.set(dayOfWeek, { type: "day", status: 1, name: dayOfWeek, slot: [...slot.slot], _id: slot._id });
                        }
                    }
                });

                // Step 3: Convert the Map back to an array
                availability.slots = Array.from(daySlotsMap.values());
            });
            // return res.json({
            //     status: 1,
            //     message: "Availiable slotskkkkkk",
            //     data: availabilityData,

            // });
            //const currentTime = moment().format('HH:MM A');
            const currentTime = moment().tz(process.env.ZOOM_TIMEZONE).format("HH:mm A");
            const currentDate = new Date().toISOString().split('T')[0];
            //console.log("currentTime",currentTime);
            if (availabilityData.length > 0) {
                let updatedslots = [];
                // for (let i = 0; i < availabilityData.length; i++) {
                //     if (availabilityData[i].slots && availabilityData[i].slots.length > 0) {
                //         //console.log("aaaaaaaaaaaaaaaaa",availabilityData[i].slots);
                //         if (availabilityData[i].slots[0].slot && availabilityData[i].slots[0].slot.length > 0) {

                //             //console.log("bbbbbbbbbbbbbb",availabilityData[i].slots[0].slot);
                //             for (let j = 0; j < availabilityData[i].slots[0].slot.length; j++) {
                //                 //console.log("time",availabilityData[i].slots[0].slot[j].time);
                //                 let slot24 = convertTo24hr(availabilityData[i].slots[0].slot[j].time);
                //                 //console.log("slot24",slot24, "currentTime",currentTime);
                //                 if (slot24 > currentTime) {
                //                     //updatedslots.push(availabilityData[i].slots[0].slot[j].time);
                //                     updatedslots.push({ time: availabilityData[i].slots[0].slot[j].time });
                //                 }
                //             }
                //             availabilityData[i].slots[0].slot = updatedslots;


                //         }

                //     }
                // }
                for (let i = 0; i < availabilityData.length; i++) {
                    if (availabilityData[i].slots && availabilityData[i].slots.length > 0) {
                        if (availabilityData[i].slots[0].slot && availabilityData[i].slots[0].slot.length > 0) {
                            for (let j = 0; j < availabilityData[i].slots[0].slot.length; j++) {
                                let slotTime = availabilityData[i].slots[0].slot[j].time;
                                let slot24 = moment(slotTime, "hh:mm A").format("HH:mm"); // Convert to 24-hour format

                                //console.log("date==currentDate",date,"==",currentDate);
                                ///console.log("slotTime",slotTime,"slot24",slot24);
                                if (date == currentDate) {
                                    if (slot24 > currentTime) {
                                        updatedslots.push({ time: slotTime, slot24 }); // Store both values
                                    }
                                }
                                else if (date > currentDate) {
                                    updatedslots.push({ time: slotTime, slot24 }); // Store both values
                                }

                            }



                            // **Sort slots in ascending order**
                            updatedslots.sort((a, b) => a.slot24.localeCompare(b.slot24));

                            // Remove the extra `slot24` field after sorting
                            updatedslots = updatedslots.map(slot => ({ time: slot.time }));

                            availabilityData[i].slots[0].slot = updatedslots;
                        }
                    }
                }
                // return res.json({
                //     status: 1,
                //     message: "Availiable slotskkkkkk",
                //     data: availabilityData,

                // });
            }







            const rearrangedData = await Promise.all(
                availabilityData
                    .map((item) => item.slots)  // Extract slots
                    .flat()  // Flatten the array of slots
                    .map((slot) => slot.slot)  // Extract the time slots
                    .flat()  // Flatten the array of individual times
                    .map(async (timeObj) => {
                        // Query the database to check if the slot exists
                        const slotExists = await BookMeetingsModel.exists({
                            cognitoUserIdMenter: cognitoUserId,
                            slot: timeObj.time,
                            day: dayOfWeek,
                            date: date,
                        });

                        // Return the slot with isBooked based on the query result
                        return {
                            isBooked: slotExists ? "1" : "0",  // If the slot exists, set isBooked to "1"
                            slotname: timeObj.time,  // Assign the time as slotname
                        };
                    })
            );

            const uniqueSlots = [...new Map(rearrangedData.map(item => [item.slotname, item])).values()];




            return res.json({
                status: 1,
                message: "Availiable slots",
                data: {
                    date: date,
                    day: dayOfWeek,
                    slots: uniqueSlots,
                },

            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    bookMeeting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90"; 



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId, date, slot, personalNote, mode, meetingTitle } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId || !date || !slot || !mode || !meetingTitle) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            // Convert the input date string to a Date object
            const dateObj = new Date(date);

            // Use Intl.DateTimeFormat to get the weekday
            const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);



            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            if (myProfile.userType == 1) {
                return res.status(200).json({
                    status: 0,
                    message: "Only Mentee can schedule meeting",
                });
            }

            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }


            let slotNames = [dayOfWeek, date];
            const availability = await AvailabilityModel.aggregate([
                {
                    $match: {
                        cognitoUserId: cognitoUserId,
                        "slots.name": { $in: slotNames },
                        "slots.status": 1,
                    },
                },
            ]);

            if (!availability || availability.length === 0) {
                return res.json({ status: 0, message: 'Availability not found for this user.' });
            }

            console.log("availability", availability);

            // Loop through the first item in the availability array (assuming there's only one document for the user)
            const slotIndex = availability[0].slots.findIndex((slotname) => {
                return slotname.slot.some((timeObj) => timeObj.time === slot);
            });

            if (slotIndex === -1) {
                return res.json({ status: 0, message: 'Slot with the given time not found.', availability });
            }





            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    communicationPreferences: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            const checkConnectedUser = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy, status: 1 },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId, status: 1 }
                ]
            })
            if (!checkConnectedUser) return res.json({ status: 0, message: "Both users are not connected" });

            let checkAlreadyBook = await BookMeetingsModel.findOne({
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdMenter: cognitoUserId,
                day: dayOfWeek,
                date,
                slot,
            });

            if (checkAlreadyBook) {
                return res.status(200).json({
                    status: 0,
                    message: "This slot already booked",
                });
            }
            const slot24 = convertTo24hr(slot);

            let bookmeetingslot = await BookMeetingsModel.create({
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdMenter: cognitoUserId,
                day: dayOfWeek,
                date,
                slot,
                personalNote,
                mode,
                meetingTitle,
                slot24,
            });

            const checkAndUpdateInteraction = await interactedUserModel.findOneAndUpdate(
                {
                    $or: [
                        { fromcognitoUserId: cognitoUserIdMy, tocognitoUserId: cognitoUserId },
                        { tocognitoUserId: cognitoUserIdMy, fromcognitoUserId: cognitoUserId },
                    ],
                },
                {
                    $set: { updatedAt: new Date() },
                    $setOnInsert: {
                        fromcognitoUserId: cognitoUserIdMy,
                        tocognitoUserId: cognitoUserId,
                    },
                },
                {
                    new: true,
                    upsert: true,
                }
            );


            let firstname = "";
            if (myProfile.fullName) {
                firstname = myProfile.fullName.split(' ')[0]
            }
            let firstname2 = "";
            if (profile.fullName) {
                firstname2 = profile.fullName.split(' ')[0]
            }

            // send notification
            let message = `Your session with ${firstname} is scheduled for ${date} at ${slot}`;
            let type = `meeting`;
            let tableName = `book_meetings`;
            let notificationSave = await NotificationModel.create({
                fromCognitoId: cognitoUserIdMy,
                toCognitoId: cognitoUserId,
                requestId: bookmeetingslot._id,
                tableName,
                message: message,
                type: type,
                isTakeAction: 1,
            });


            //let messagechat1 = `${firstname} has booked a meeting with you ${date}  ${slot}`;
            let messagechat1 = `${firstname} has booked a meeting with you`;
            const saveChat1 = await ChatModel.create({
                connectedId: checkConnectedUser._id,
                fromId: cognitoUserIdMy,
                toId: cognitoUserId,
                message: "",
                messageType: 1,
                meetingId: bookmeetingslot._id,
                meetingTitle: messagechat1,
                meetingDate: date,
                meetingTime: slot,

            });
            let messagechat1socket = `${firstname} has booked a meeting with you ${date}  ${slot}`;
            io.emit("sendMessage", {
                status: 1,
                connectedId: checkConnectedUser._id,
                sendercognitoUserId: cognitoUserIdMy,
                receivercognitoUserId: cognitoUserId,
                profilePic: myProfile.profilePic,
                message: "",
                messageType: 1,
                meetingId: bookmeetingslot._id,
                meetingTitle: messagechat1,
                meetingDate: date,
                meetingTime: slot,
                updatedAt: saveChat1.updatedAt,
                meetingNote: personalNote
            });

            // let messagechat2 = `You have booked a meeting with ${firstname2} ${date}  ${slot}`;
            // const saveChat2 = await ChatModel.create({
            //     fromId: cognitoUserId,
            //     toId: cognitoUserIdMy,
            //     message:messagechat2,
            //     messageType:1,
            //     meetingId:bookmeetingslot._id,
            // });
            // io.emit("sendMessage", {
            //     status: 1,
            //     sendercognitoUserId: cognitoUserId,
            //     receivercognitoUserId: cognitoUserIdMy,
            //     profilePic:profile.profilePic,
            //     message: messagechat2,
            //     updatedAt:saveChat2.updatedAt,
            //     meetingNote:personalNote
            // });

            //pushnotification

            const userToNotification = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }
            );

            if (userToNotification) {
                if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "Book Meeting",
                            body: message,
                            //data:notificationSave,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                }
            }

            const rating = await getUserRating({ cognitoUserIdMy: cognitoUserId });
            const userdetail = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] },
                    interests: 1,
                } // Projection
            );

            const bookmeetingslotWithAddition = {
                ...bookmeetingslot.toObject(),
                rating,
                userdetail
            };



            return res.json({
                status: 1,
                message: "Your slot booked successfully",
                data: bookmeetingslotWithAddition,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    editMeeting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90"; 



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { meetingId, cognitoUserId, date, slot, personalNote, mode, meetingTitle } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!meetingId || !cognitoUserId || !date || !slot || !mode || !meetingTitle) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            let checkBooking = await BookMeetingsModel.findOne({
                _id: meetingId
            });

            if (!checkBooking) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId",
                });
            }

            // Convert the input date string to a Date object
            const dateObj = new Date(date);

            // Use Intl.DateTimeFormat to get the weekday
            const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);



            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            //    if(myProfile.userType == 1)
            //     {
            //          return res.status(200).json({
            //              status: 0,
            //              message: "Only Mentee can schedule meeting",
            //          });
            //     }

            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }


            let slotNames = [dayOfWeek, date];
            if (myProfile.userType == 0) {
                const availability = await AvailabilityModel.aggregate([
                    {
                        $match: {
                            cognitoUserId: cognitoUserId,
                            "slots.name": { $in: slotNames },
                            "slots.status": 1,
                        },
                    },
                ]);

                if (!availability || availability.length === 0) {
                    return res.json({ status: 0, message: 'Availability not found for this user.' });
                }
                console.log("availability", availability);

                // Loop through the first item in the availability array (assuming there's only one document for the user)
                const slotIndex = availability[0].slots.findIndex((slotname) => {
                    return slotname.slot.some((timeObj) => timeObj.time === slot);
                });

                if (slotIndex === -1) {
                    return res.json({ status: 0, message: 'Slot with the given time not found.', availability });
                }
            }








            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    communicationPreferences: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            let checkAlreadyBook = await BookMeetingsModel.findOne({
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdMenter: cognitoUserId,
                day: dayOfWeek,
                date,
                slot,
            });

            if (checkAlreadyBook) {
                return res.status(200).json({
                    status: 0,
                    message: "This slot already booked",
                });
            }

            // let bookmeetingslot = await BookMeetingsModel.create({
            //     cognitoUserId: cognitoUserIdMy,
            //     cognitoUserIdMenter: cognitoUserId,
            //     day: dayOfWeek,
            //     date,
            //     slot,
            //     personalNote,
            //     mode,
            //     meetingTitle
            // });
            const slot24 = convertTo24hr(slot);
            const filter = { _id: meetingId };
            let update = {
                cognitoUserId: cognitoUserIdMy,
                cognitoUserIdMenter: cognitoUserId,
                day: dayOfWeek,
                date,
                slot,
                personalNote,
                mode,
                meetingTitle,
                slot24
            };
            const bookmeetingslot = await BookMeetingsModel.findOneAndUpdate(filter, { $set: update }, { new: true });

            const filter1 = { requestId: meetingId };
            const deletedNotification = await NotificationModel.deleteMany(filter1);

            const checkAndUpdateInteraction = await interactedUserModel.findOneAndUpdate(
                {
                    $or: [
                        { fromcognitoUserId: cognitoUserIdMy, tocognitoUserId: cognitoUserId },
                        { tocognitoUserId: cognitoUserIdMy, fromcognitoUserId: cognitoUserId },
                    ],
                },
                {
                    $set: { updatedAt: new Date() },
                    $setOnInsert: {
                        fromcognitoUserId: cognitoUserIdMy,
                        tocognitoUserId: cognitoUserId,
                    },
                },
                {
                    new: true,
                    upsert: true,
                }
            );

            // send notification
            //let message = `Your session with ${myProfile.fullName} is rescheduled for ${date} at ${slot}`;
            let message = `Your session with ${myProfile.fullName} has been rescheduled from ${checkBooking.date} at ${checkBooking.slot} to ${date} at ${slot}.`;
            let type = `meeting`;
            let tableName = `book_meetings`;
            let notificationSave = await NotificationModel.create({
                fromCognitoId: cognitoUserIdMy,
                toCognitoId: cognitoUserId,
                requestId: bookmeetingslot._id,
                tableName,
                message: message,
                type: type,
                isTakeAction: 1,
            });

            let message1 = `Your session with ${profile.fullName} has been rescheduled from ${checkBooking.date} at ${checkBooking.slot} to ${date} at ${slot}.`;

            let notificationSave1 = await NotificationModel.create({
                fromCognitoId: cognitoUserId,
                toCognitoId: cognitoUserIdMy,
                requestId: bookmeetingslot._id,
                tableName,
                message: message1,
                type: type,
                isTakeAction: 1,
            });

            //pushnotification

            const userToNotification = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }
            );

            if (userToNotification) {
                if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "Rescheduled Meeting",
                            body: message,
                            //data:notificationSave,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                }
            }

            //pushnotification1

            const userToNotification1 = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }
            );

            if (userToNotification1) {
                if (Array.isArray(userToNotification1.deviceToken) && userToNotification1.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "Rescheduled Meeting",
                            body: message1,
                            //data:notificationSave1,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave1),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification1.deviceToken, payload });
                }
            }


            const rating = await getUserRating({ cognitoUserIdMy: cognitoUserId });
            const userdetail = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] },
                    interests: 1,
                } // Projection
            );

            const bookmeetingslotWithAddition = {
                ...bookmeetingslot.toObject(),
                rating,
                userdetail
            };



            return res.json({
                status: 1,
                message: "Your slot booked successfully",
                data: bookmeetingslotWithAddition,


            });



        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },
    cancelMeeting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90"; 



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { meetingId, cognitoUserId } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!meetingId) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            let checkBooking = await BookMeetingsModel.findOne({
                _id: meetingId
            });

            if (!checkBooking) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId",
                });
            }





            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            //    if(myProfile.userType == 1)
            //     {
            //             return res.status(200).json({
            //                 status: 0,
            //                 message: "Only Mentee can cancel meeting",
            //             });
            //     }

            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }

            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    communicationPreferences: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            const filter = { _id: meetingId };
            const deletedMeeting = await BookMeetingsModel.findByIdAndDelete(meetingId);
            if (!deletedMeeting) {
                return res.json({ status: 0, message: "Meeting not found!" });
            }

            const filter1 = { requestId: meetingId };
            const deletedNotification = await NotificationModel.deleteMany(filter1);


            // let update = {
            //     cognitoUserId: cognitoUserIdMy,
            // }; 
            // const bookmeetingslot = await BookMeetingsModel.findOneAndUpdate(filter, { $set: update }, { new: true });

            // send notification
            let message = `Your session with ${myProfile.fullName} is cancelled for ${checkBooking.date} at ${checkBooking.slot}`;
            let type = `meeting`;
            let tableName = `book_meetings`;
            let notificationSave = await NotificationModel.create({
                fromCognitoId: cognitoUserIdMy,
                toCognitoId: cognitoUserId,
                requestId: meetingId,
                tableName,
                message: message,
                type: type,
                isTakeAction: 1,
            });

            //pushnotification

            const userToNotification = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }
            );

            if (userToNotification) {
                if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "Cancel Meeting",
                            body: message,
                            //data:notificationSave,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                }
            }

            const rating = await getUserRating({ cognitoUserIdMy: cognitoUserId });
            const userdetail = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] },
                    interests: 1,
                } // Projection
            );

            const bookmeetingslotWithAddition = {
                ...checkBooking.toObject(),
                rating,
                userdetail
            };



            return res.json({
                status: 1,
                message: "Your slot canceled successfully",
                data: bookmeetingslotWithAddition,


            });



        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    endMeeting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90"; 



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId, meetingId } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId || !meetingId) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }





            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });


            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }




            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    communicationPreferences: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            let checkBooking = await BookMeetingsModel.findOne({
                _id: meetingId
            });

            if (!checkBooking) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId",
                });
            }
            if (checkBooking.status == 2) {
                return res.status(200).json({
                    status: 0,
                    message: "Already end meeting",
                });
            }

            const filter = { _id: meetingId };
            let update = {};
            update.status = 2;
            const updateBooking = await BookMeetingsModel.findOneAndUpdate(filter, { $set: update }, { new: true });



            // send notification to first
            let firstname = "";
            if (myProfile.fullName) {
                firstname = myProfile.fullName.split(' ')[0]
            }
            let message = `How was your recent session with ${firstname}? Share your feedback!`;
            let type = `meeting`;
            let tableName = `book_meetings`;
            let notificationSave = await NotificationModel.create({
                fromCognitoId: cognitoUserIdMy,
                toCognitoId: cognitoUserId,
                requestId: meetingId,
                tableName,
                message: message,
                type: type,
                isTakeAction: 1,
            });

            //pushnotification

            const userToNotification = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId }
            );

            if (userToNotification) {
                if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "End Meeting",
                            body: message,
                            //data:notificationSave,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification.deviceToken, payload });
                }
            }

            // send notification to second
            let firstname1 = "";
            if (profile.fullName) {
                firstname1 = profile.fullName.split(' ')[0]
            }
            let message1 = `How was your recent session with ${firstname}? Share your feedback!`;
            let type1 = `meeting`;
            let tableName1 = `book_meetings`;
            let notificationSave1 = await NotificationModel.create({
                fromCognitoId: cognitoUserId,
                toCognitoId: cognitoUserIdMy,
                requestId: meetingId,
                tableName: tableName1,
                message: message1,
                type: type1,
                isTakeAction: 1,
            });

            //pushnotification

            const userToNotification1 = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }
            );

            if (userToNotification1) {
                if (Array.isArray(userToNotification1.deviceToken) && userToNotification1.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "End Meeting",
                            body: message1,
                            //data:notificationSave,
                            content_available: "true",
                            //image:"https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg"
                        },
                        data: {
                            "data": JSON.stringify(notificationSave1),
                        }
                    }
                    await PushNotification({ registrationToken: userToNotification1.deviceToken, payload });
                }
            }

            return res.json({
                status: 1,
                message: "Your booking ended successfully",
                data: updateBooking,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    sendFeedBack: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "73c478e2-f091-703a-cdf3-d1ed55eafe90"; 



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId, meetingId, rating, feedback } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId || !rating) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });


            if (cognitoUserId === cognitoUserIdMy) {
                return res.status(200).json({
                    status: 0,
                    message: "Both users are same",
                });
            }

            const profile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserId },
                {
                    cognitoUserId: 1,
                    email: 1,
                    communicationPreferences: 1,
                    location: 1,
                    country: 1,
                    city: 1,
                    iso2: 1,
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });

            // if (myProfile.userType == 1) {
            //     return res.status(200).json({
            //         status: 0,
            //         message: "Only Mentee can gave feedback",
            //     });
            // }

            let checkMeetingExists = await BookMeetingsModel.findOne({
                _id: meetingId,
            });

            if (!checkMeetingExists) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId",
                });
            }



            const checkAlreadyFeedback = await feedbackModel.find({
                $or: [
                    { fromId: cognitoUserIdMy, toId: cognitoUserId, meetingId: meetingId },
                    // { fromId: cognitoUserId, toId: cognitoUserIdMy, meetingId: meetingId }
                ]
            })
            //console.log("checkAlreadyFeedback",checkAlreadyFeedback);

            if (checkAlreadyFeedback.length > 0) {
                return res.status(200).json({
                    status: 0,
                    message: "You have already gave feedback for this meeting",
                });
            }



            let sendFeedbackData = await feedbackModel.create({
                fromId: cognitoUserIdMy,
                toId: cognitoUserId,
                meetingId: meetingId,
                feedback: feedback,
                rating,
            });



            return res.json({
                status: 1,
                message: "Your feedback sent successfully",
                data: sendFeedbackData,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getFeedbackDetails: async (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;

        
        try {
           
            const { cognitoUserId, offset = 0, limit = 10 } = req.body; // Default offset = 0, limit = 10
            const parsedOffset = parseInt(offset);
            const parsedLimit = parseInt(limit);

            let sendFeedbackData = await feedbackModel.find({ toId: cognitoUserId }).lean();
            
            const filteredFeedback = sendFeedbackData.filter(item => item.feedback.trim() !== '');

            //const totalRating = filteredFeedback.reduce((sum, item) => sum + item.rating, 0);
            //const averageRating = filteredFeedback.length > 0 ? (totalRating / filteredFeedback.length).toFixed(2) : 0;
            const averageRating = await getUserRating({ cognitoUserIdMy: cognitoUserId });
            

            // Apply pagination
            const paginatedFeedback = filteredFeedback.slice(parsedOffset, parsedOffset + parsedLimit);
            console.log("paginatedFeedback",paginatedFeedback);

            const feedbackWithUserDetails = await Promise.all(
                paginatedFeedback.map(async (item) => {
                    //const user = await UsersModel.findOne({ cognitoUserId: item.fromId }, 'firstName lastName country state city iso2');
                    const user = await UsersModel.findOne({ cognitoUserId: item.fromId }, 'fullName location country city iso2');
                    return {
                        ...item,
                        fullName: user?.fullName || '',
                        location: user?.location || '',
                        country: user?.country || '',
                        city: user?.city || '',
                        iso2: user?.iso2 || '',
                        
                    };
                })
            );

            return res.json({
                status: 1,
                message: "Feedback details fetched successfully",
                feedback: feedbackWithUserDetails,
                reviewCountRating: {
                    averageRating: averageRating,
                    feedbackCount: sendFeedbackData.length
                }
            });

        } catch (error) {
            return res.status(500).json({ status: 0, message: "Error fetching feedback", error: error.message });
        }
    },

    deleteConnectedUsers: async (req, res) => {

        const { cognitoUserId1, cognitoUserId2 } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            if (!cognitoUserId1 || !cognitoUserId2) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }

            const deleteNotification = await NotificationModel.deleteMany({
                $or: [
                    { fromCognitoId: cognitoUserId1, toCognitoId: cognitoUserId2 },
                    { fromCognitoId: cognitoUserId2, toCognitoId: cognitoUserId1 }
                ]
            })
            const deleteConnected = await ConnectedUserModel.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId1, cognitoUserIdSave: cognitoUserId2 },
                    { cognitoUserId: cognitoUserId2, cognitoUserIdSave: cognitoUserId1 }
                ]
            })
            const deleteUnConnected = await UnConnectedUserModel.deleteMany({
                $or: [
                    { cognitoUserId: cognitoUserId1, cognitoUserIdSave: cognitoUserId2 },
                    { cognitoUserId: cognitoUserId2, cognitoUserIdSave: cognitoUserId1 }
                ]
            })




            return res.json({
                status: 1,
                message: "Data deleted successfully",


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getUpcomingMeetings: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;




        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const currentDate = moment().format('YYYY-MM-DD');
            const currentTime = moment().format('HH:mm A');
            // Add 30 minutes
            //const withDurationTime = moment().subtract(process.env.MEETING_DURATION_TIME, 'minutes').format('HH:mm A');

            const withDurationTime = moment()
                .tz(process.env.ZOOM_TIMEZONE) // Set timezone to Asia/Kolkata
                .subtract(process.env.MEETING_DURATION_TIME, "minutes")
                .format("HH:mm A");


            //console.log("currentDate", currentDate);
            //console.log("currentTime", currentTime);
            //console.log("withDurationTime", withDurationTime);

            const meetingsList = await BookMeetingsModel.find({
                $and: [
                    {
                        $or: [
                            { cognitoUserId: cognitoUserIdMy },
                            { cognitoUserIdMenter: cognitoUserIdMy }
                        ]
                    },
                    {
                        $or: [
                            // Meetings on a future date
                            { date: { $gt: currentDate } },
                            // Meetings on the same date but a future time
                            {
                                date: currentDate,
                                // slot: { $gt: currentTime }
                                slot24: { $gt: withDurationTime }
                            }
                        ]
                    }
                ]
            })
                .sort({ date: 1, slot24: 1 }) // Sort by date and time
                .skip(offsetstart)
                .limit(limit)
                .lean();

            const matchedUsers = await Promise.all(
                meetingsList.map(async (user) => {
                    let finduser = "";
                    if (user.cognitoUserId == cognitoUserIdMy) {
                        finduser = user.cognitoUserIdMenter;
                    }
                    else {
                        finduser = user.cognitoUserId;
                    }

                    // Check if user is saved
                    const userdetail = await UsersModel.findOne(
                        { cognitoUserId: finduser }, // Query filter
                        {
                            cognitoUserId: 1,
                            email: 1,
                            userType: 1,
                            location: 1,
                            country: 1,
                            city: 1,
                            iso2: 1,
                            fullName: { $ifNull: ["$fullName", ""] },
                            profilePic: { $ifNull: ["$profilePic", ""] },
                            interests: 1,
                        } // Projection
                    );



                    return {
                        ...user,
                        userdetail, // Whether the user is saved
                    };
                })
            );


            return res.json({
                status: 1,
                message: "Meetings list",
                data: matchedUsers,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getPastMeetings: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;




        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            let wheredata = [];
            if (myProfile.userType == 1) {

                wheredata = [
                    { cognitoUserId: cognitoUserIdMy, deleteByMenter: 0 },
                    { cognitoUserIdMenter: cognitoUserIdMy, deleteByMenter: 0 }
                ];
            }
            else {
                wheredata = [
                    { cognitoUserId: cognitoUserIdMy, deleteByMentee: 0 },
                    { cognitoUserIdMenter: cognitoUserIdMy, deleteByMentee: 0 }
                ]
            }

            const currentDate = moment().format('YYYY-MM-DD');
            const currentTime = moment().format('hh:mm A');
            // Add 30 minutes

            //const withDurationTime = moment().subtract(process.env.MEETING_DURATION_TIME, 'minutes').format('hh:mm A');
            const withDurationTime = moment()
                .tz(process.env.ZOOM_TIMEZONE) // Set timezone to Asia/Kolkata
                .subtract(process.env.MEETING_DURATION_TIME, "minutes")
                .format("HH:mm A");





            const meetingsList = await BookMeetingsModel.find({
                $and: [
                    {
                        $or: wheredata
                    },
                    {
                        $or: [
                            // Meetings on a past date
                            { date: { $lt: currentDate } },
                            // Meetings on the same date but a past time
                            {
                                date: currentDate,
                                //slot: { $lt: currentTime }
                                slot24: { $lt: withDurationTime }
                            }
                        ]
                    }
                ]
            })
                .sort({ date: -1, slot24: -1 }) // Sort by date and time
                .skip(offsetstart)
                .limit(limit)
                .lean();

            const matchedUsers = await Promise.all(
                meetingsList.map(async (user) => {
                    let finduser = "";
                    if (user.cognitoUserId == cognitoUserIdMy) {
                        finduser = user.cognitoUserIdMenter;
                    }
                    else {
                        finduser = user.cognitoUserId;
                    }

                    // Check if user is saved
                    const userdetail = await UsersModel.findOne(
                        { cognitoUserId: finduser }, // Query filter
                        {
                            cognitoUserId: 1,
                            email: 1,
                            userType: 1,
                            location: 1,
                            country: 1,
                            city: 1,
                            iso2: 1,
                            emailDomainVerified: 1,
                            fullName: { $ifNull: ["$fullName", ""] },
                            profilePic: { $ifNull: ["$profilePic", ""] },
                            interests: 1,
                        } // Projection
                    );
                    const feedback = await feedbackModel.find(
                        { meetingId: user._id, fromId: cognitoUserIdMy },
                    );
                    const rating = await getUserRating({ cognitoUserIdMy: finduser });
                    //console.log("rating",rating);
                    userdetail.rating = rating;




                    const updatedUserDetail = userdetail ? { ...userdetail.toObject(), rating } : null;
                    return {
                        ...user,
                        userdetail: updatedUserDetail, // Ensure userdetail is properly formatted
                        feedback,
                    };
                })
            );


            return res.json({
                status: 1,
                message: "Meetings list",
                data: matchedUsers,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    deletePastMeeting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;




        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { meetingId } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            let checkMeetingExists = await BookMeetingsModel.findOne({
                _id: meetingId,
            });

            if (!checkMeetingExists) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId",
                });
            }

            const checkMeetingValid = await BookMeetingsModel.find({
                $or: [
                    { cognitoUserId: cognitoUserIdMy, _id: meetingId },
                    { cognitoUserIdMenter: cognitoUserIdMy, _id: meetingId }
                ]
            })

            if (!checkMeetingValid) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId for this user",
                });
            }
            if (myProfile.userType == "1") {
                checkMeetingExists.deleteByMenter = 1;
            }
            else {
                checkMeetingExists.deleteByMentee = 1;
            }

            checkMeetingExists.save();

            return res.json({
                status: 1,
                message: "Meeting deleted successfully",
                data: checkMeetingExists,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },


    contactUs: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //const cognitoUserIdMy = "a3f458d2-10a1-70cc-d6e3-0550a9c75624";




        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { type, message } = req.body;


        try {
            if (!type) return res.json({ status: 0, message: "Type required" });
            if (!message) return res.json({ status: 0, message: "Message required" });

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });


            if (type == "Data Subject Access Request") {
                let subjectstatic = 'Contact Request Recieved!';
                let requests = req.body.requests;


                // Remove any leading or trailing single quotes that may exist
                if (requests.startsWith("'") && requests.endsWith("'")) {
                    requests = requests.slice(1, -1);
                }
                let parsedDataRequests;
                try {
                    // Now parse the cleaned JSON string
                    parsedDataRequests = JSON.parse(requests);
                    //console.log("parsedData=>>>", parsedDataInterests);
                } catch (error) {
                    //console.error("Error parsing interests:", error);
                }

                if (parsedDataRequests.length === 0) {
                    return res.json({ status: 0, message: "Requests array cannot be empty." });
                }

                //console.log("parsedDataRequests",parsedDataRequests);

                const body = contactUsEmailBodyDSAR(
                    myProfile.fullName,
                    myProfile.email,
                    type,
                    parsedDataRequests,
                    message
                );

                try {

                    await sendEmail(process.env.S3_TO_CONTACT_EMAIL, subjectstatic, body);
                    return res.json({
                        status: 1,
                        message: "Email sent successfully",
                    });

                } catch (error) {
                    console.error('Error sending email:', error);
                    return res.json({ status: 0, message: error.message });

                }
            }
            else {
                let subjectstatic = req.body.subject;
                const body = contactUsEmailBody(
                    myProfile.fullName,
                    myProfile.email,
                    type,
                    message
                );

                try {

                    await sendEmail(process.env.S3_TO_CONTACT_EMAIL, subjectstatic, body);
                    return res.json({
                        status: 1,
                        message: "Email sent successfully",
                    });

                } catch (error) {
                    console.error('Error sending email:', error);
                    return res.json({ status: 0, message: error.message });

                }
            }

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    startConversation: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });

            const checkConnectedUser = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId }
                ]
            })
            if (!checkConnectedUser) return res.json({ status: 0, message: "Both users are not connected" });

            let update = {
                startConversation: checkConnectedUser.startConversation || []
            };
            //update.startConversation = 1;

            // if(checkConnectedUser.cognitoUserId == cognitoUserIdMy)
            // {
            //     update.startConversationcognitoUserId = 1;
            //     idsToCheck.push();
            // }
            // else if(checkConnectedUser.cognitoUserIdSave == cognitoUserIdMy)
            // {
            //     update.startConversationcognitoUserIdSave = 1;
            // }

            const idsToCheck = [cognitoUserIdMy];
            //console.log("idsToCheck", idsToCheck);

            idsToCheck.forEach((id) => {
                if (!update.startConversation.includes(id)) {
                    update.startConversation.push(id);
                }
            });



            const filter = {
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId }
                ]
            };

            const profile = await ConnectedUserModel.findOneAndUpdate(filter, { $set: update }, { new: true });




            return res.status(200).json({
                status: 1,
                message: "Conversation start successfully",
                data: profile,
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    enableFirstSession: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;



        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { cognitoUserId } = req.body;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy },
                // { cognitoUserId: 0 } // Projection to exclude fields
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            if (myProfile.userType == 1) {
                return res.status(200).json({
                    status: 0,
                    message: "Only Mentee can enable first session",
                });
            }

            const checkConnectedUser = await ConnectedUserModel.findOne({
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId }
                ]
            })
            if (!checkConnectedUser) return res.json({ status: 0, message: "Both users are not connected" });

            let update = {
                isBookFirstSession: 1
            }


            const filter = {
                $or: [
                    { cognitoUserId: cognitoUserId, cognitoUserIdSave: cognitoUserIdMy },
                    { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: cognitoUserId }
                ]
            };

            const profile = await ConnectedUserModel.findOneAndUpdate(filter, { $set: update }, { new: true });




            return res.status(200).json({
                status: 1,
                message: "First session start successfully",
                data: profile,
            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getPreviouslyInteracted: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const cognitoUserIdMy = decoded.username;
        //console.log("cognitoUserIdMy",cognitoUserIdMy);




        //console.log("cognitoUserIdMy",cognitoUserIdMy);
        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;

        //console.log("cognitoUserId",cognitoUserId);
        try {

            const myProfile = await UsersModel.findOne(
                { cognitoUserId: cognitoUserIdMy }, // Query filter
                {
                    cognitoUserId: 1,
                    email: 1,
                    userType: 1,
                    interests: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );

            if (!myProfile) return res.json({ status: 0, message: "Invalid user" });
            const myInterestNames = myProfile.interests.map((interest) => interest.name);
            //console.log("myInterestNames",myInterestNames);

            const ignoreCognitoUserId = [];
            const blockedUsersList = await BlockedUsers.find({
                cognitoUserId: cognitoUserIdMy,
                status:1
            })
            blockedUsersList.forEach(block => {
                let ignoreid = block.blockedUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            const InactiveUsersList = await UsersModel.find(
                { isActive: 0 }, 
                { cognitoUserId: 1, _id: 0 }
            );
            InactiveUsersList.forEach(block => {
                let ignoreid = block.cognitoUserId;
                if (!ignoreCognitoUserId.includes(ignoreid)) {
                    ignoreCognitoUserId.push(ignoreid);
                }
            });
            //console.log("ignoreCognitoUserId",ignoreCognitoUserId);
            //console.log("myProfile.userType",myProfile.userType);
            let wheredata = [];
            if (myProfile.userType == 1) {

                wheredata = [
                    { fromcognitoUserId: cognitoUserIdMy },
                    { tocognitoUserId: cognitoUserIdMy },
                    //{fromcognitoUserId: { $nin: ignoreCognitoUserId }},
                    //{tocognitoUserId: { $nin: ignoreCognitoUserId }},
                ];
            }
            else {
                wheredata = [
                    { fromcognitoUserId: cognitoUserIdMy },
                    { tocognitoUserId: cognitoUserIdMy },
                    //{fromcognitoUserId: { $nin: ignoreCognitoUserId }},
                    //{tocognitoUserId: { $nin: ignoreCognitoUserId }},
                ]
            }
            const interactedList = await interactedUserModel.find({
                $and: [
                    {
                        $or: wheredata
                    }
                ],
                fromcognitoUserId: { $nin: ignoreCognitoUserId },
                tocognitoUserId: { $nin: ignoreCognitoUserId }
            })
                .sort({ updatedAt: -1 })
                .skip(offsetstart)
                .limit(limit)
                .lean();



            const matchedUsers = await Promise.all(
                interactedList.map(async (user) => {
                    let finduser = "";
                    if (user.fromcognitoUserId == cognitoUserIdMy) {
                        finduser = user.tocognitoUserId;
                    }
                    else {
                        finduser = user.fromcognitoUserId;
                    }

                    // Check if user is saved
                    const userdetail = await UsersModel.findOne(
                        { cognitoUserId: finduser }, // Query filter
                        {
                            cognitoUserId: 1,
                            email: 1,
                            userType: 1,
                            location: 1,
                            country: 1,
                            city: 1,
                            iso2: 1,
                            fullName: { $ifNull: ["$fullName", ""] },
                            profilePic: { $ifNull: ["$profilePic", ""] },
                            interests: 1,
                            age: 1,
                            bio: 1,
                        } // Projection
                    ).lean();
                    //console.log("userdetailinterest",userdetail.interests);
                    const matchingInterests = userdetail.interests.filter((interest) =>
                        myInterestNames.includes(interest.name)
                    );

                    // Calculate match percentage, handle empty myInterestNames
                    const matchPercentage = myInterestNames.length > 0
                        ? Math.round((matchingInterests.length / myInterestNames.length) * 100)
                        : 0;

                    //console.log("matchPercentage",matchPercentage);

                    userdetail.matchPercentage = matchPercentage;

                    const connectedData = await ConnectedUserModel.findOne({
                        $or: [
                            { cognitoUserId: finduser, cognitoUserIdSave: cognitoUserIdMy },
                            { cognitoUserId: cognitoUserIdMy, cognitoUserIdSave: finduser },
                        ]
                    });
                    const isRequestSent = connectedData ? 1 : 0;
                    const isMeetingEnable = connectedData?.status || 0;
                    const rating = await getUserRating({ cognitoUserIdMy: user.tocognitoUserId });



                    return {
                        ...user,
                        userdetail,
                        isRequestSent,
                        isMeetingEnable,
                        rating,
                    };
                })
            );


            return res.json({
                status: 1,
                message: "Previous Interacted list",
                data: matchedUsers,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getInterests: async (req, res) => {

        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            const interestsList = await InterestsModel.find({})
                .sort({ updatedAt: -1, })
            //.skip(offsetstart)
            //.limit(limit)
            //.lean();
            return res.json({
                status: 1,
                message: "Interests list",
                data: interestsList,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    getIndustries: async (req, res) => {

        const { offset } = req.body;
        const limit = parseInt(process.env.PAGINATION_LIMIT) || 10;
        const offsetstart = parseInt(offset) || 0;

        //console.log("cognitoUserId",cognitoUserId);
        try {
            const IndustriesList = await IndustryModel.find({})
                .sort({ updatedAt: -1, })
            //.skip(offsetstart)
            //.limit(limit)
            //.lean();
            return res.json({
                status: 1,
                message: "Industries list",
                data: IndustriesList,


            });

        } catch (error) {
            //res.status(500).json({ message: 'Error fetching profile', error });
            return res.json({ status: 0, message: error.message });
        }
    },




};

module.exports = profileController;