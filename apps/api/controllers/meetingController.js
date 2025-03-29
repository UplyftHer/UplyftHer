const mongoose = require('mongoose');
const io = require("../server");
const fetch = require("node-fetch");
const base64 = require("base-64");

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { FirebaseData, PushNotification } = require("../utils/firebase.js");
const NotificationModel = require('../models/NotificationModel');

const zoomAccountId = process.env.ZOOM_ACCOUNT_ID;
const zoomClientId = process.env.ZOOM_CLIENT_ID;
const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;

//const moment = require('moment');
const moment = require("moment-timezone");
const UsersModel = require('../models/UsersModel');
const BookMeetingsModel = require('../models/BookMeetingsModel');

const getAuthHeaders = () => {
    return {
        Authorization: `Basic ${base64.encode(
            `${zoomClientId}:${zoomClientSecret}`
        )}`,
        "Content-Type": "application/json",
    };
};

const generateRandomString = (length = 12) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

const generateZoomAccessToken = async () => {
    try {
        const response = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
            }
        );

        const jsonResponse = await response.json();
        //console.log("generateZoomAccessToken jsonResponse----->", jsonResponse);

        return jsonResponse?.access_token;
    } catch (error) {
        console.log("generateZoomAccessToken Error --> ", error);
        throw error;
    }
};


const meetingController = {
     
    createMeeting: async (req, res) => {
        // console.log("process.env.JWT_SECRET",process.env.JWT_SECRET);
         const token = req.headers.authorization.split(' ')[1]; 
         const decoded = jwt.verify(token, process.env.JWT_SECRET); 
         const cognitoUserIdMy = decoded.username; 
        //const cognitoUserIdMy = "a3f458d2-10a1-70cc-d6e3-0550a9c75624"; 

        try {
            const { meetingId, cognitoUserId, date, slot } = req.body;
            if (!meetingId || !cognitoUserId || !date || !slot) {
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
                    userType: 1,
                    fullName: { $ifNull: ["$fullName", ""] },
                    profilePic: { $ifNull: ["$profilePic", ""] }
                } // Projection
            );
            if (!profile) return res.json({ status: 0, message: "Invalid cognitoUserId" });
            
           

            
            //let date = "2025-01-24";
            // let slot = "11:30";
            let slotDuration = 30;
            
            const slotMoment = moment(`${date} ${slot}`, "YYYY-MM-DD HH:mm");
            const slotStart = slotMoment.subtract(slotDuration, 'minutes').format("HH:mm"); // 0 minute before
            //const slotEnd = slotMoment.add(slotDuration, 'minutes').format("HH:mm"); // Reset to original time
            const slotEnd = slot

            console.log("slotStart",slotStart);
            console.log("slotEnd",slotEnd);
          

            const checkMeetingExists = await BookMeetingsModel.findOne({
                $or: [
                    { _id: meetingId, date:date, slot24: { $gte: slotStart, $lte: slotEnd}, cognitoUserId:cognitoUserId, cognitoUserIdMenter: cognitoUserIdMy },
                    { _id: meetingId, date:date, slot24: { $gte: slotStart, $lte: slotEnd}, cognitoUserId:cognitoUserIdMy, cognitoUserIdMenter: cognitoUserId },
                ]
            })
            if (!checkMeetingExists) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid meetingId",
                });
            }


            const dateMeeting = checkMeetingExists.date;
            console.log("dateMeeting",dateMeeting);
            const timeMeeting = checkMeetingExists.slot24;
            console.log("timeMeeting",timeMeeting);

            const slotMomentBook = moment(`${date} ${slot}`, "YYYY-MM-DD HH:mm");
            const futureTime = slotMomentBook.add(slotDuration, 'minutes').format("HH:mm"); // Reset to original time

            

            
            const currentTime = moment().tz(process.env.ZOOM_TIMEZONE).format("HH:mm");
           
            //console.log("futureTime",futureTime);
            const currentDate = new Date().toISOString().split('T')[0];
            //console.log("currentDate",currentDate);

            //console.log(slot ,"<" ,timeMeeting, "&&" ,slot, ">", futureTime);
            const current = new Date(currentDate);
            const meeting = new Date(dateMeeting);
            const timeDifference = meeting.getTime() - current.getTime();
            const daysUntilMeeting = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

            let message;
            if (daysUntilMeeting > 1) {
                message = `Your scheduled meeting is in ${daysUntilMeeting} days. Kindly be ready to join at the scheduled time.`;
            } else if (daysUntilMeeting === 1) {
                message = "Your scheduled meeting is tomorrow. Kindly be ready to join at the scheduled time.";
            } else if (daysUntilMeeting === 0) {
                message = "Your scheduled meeting is today. Kindly be ready to join at the scheduled time.";
            } else {
                message = "The meeting date has already passed.";
            }

            const currentDateTime = moment().tz(process.env.ZOOM_TIMEZONE);
            const meetingStart = moment.tz(`${dateMeeting} ${timeMeeting}`, 'YYYY-MM-DD HH:mm', process.env.ZOOM_TIMEZONE);
            const meetingEnd = meetingStart.clone().add(slotDuration, 'minutes');
            // Calculate the difference in milliseconds
            const timeDifference1 = meetingStart.diff(currentDateTime);

            // Convert time difference to days, hours, and minutes
            const daysUntilMeeting1 = Math.floor(timeDifference1 / (1000 * 60 * 60 * 24));
            const hoursUntilMeeting = Math.floor((timeDifference1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesUntilMeeting = Math.floor((timeDifference1 % (1000 * 60 * 60)) / (1000 * 60));
            const secondsUntilMeeting = Math.floor((timeDifference1 % (1000 * 60)) / 1000);
            let messageTime;
            if (hoursUntilMeeting > 1) {
                messageTime = `Your scheduled meeting is in ${hoursUntilMeeting} hours. Kindly be ready to join at the scheduled time.`;
            } else if (hoursUntilMeeting === 1) {
                messageTime = "Your scheduled meeting is in an hour. Kindly be ready to join at the scheduled time.";
            } else if (minutesUntilMeeting > 0) {
                messageTime = `Your scheduled meeting is in ${minutesUntilMeeting} minutes. Kindly be ready to join at the scheduled time.`;
            } else if (secondsUntilMeeting > 0) {
                messageTime = `Your scheduled meeting is in ${secondsUntilMeeting} seconds. Kindly be ready to join now.`;
            }
            else {
                messageTime = "The meeting time has already passed.";
            }


            if(dateMeeting != date || currentDate != date)
            {
                return res.status(200).json({
                    status: 0,
                    message: message,
                });
            }
            else if (currentDateTime.isBefore(meetingStart) || currentDateTime.isAfter(meetingEnd))
            {
                return res.status(200).json({
                    status: 0,
                    message: messageTime,
                });
            }


           
            

            if (myProfile.userType == 0) {
                //if(checkMeetingExists.join_url == "")
                if (!checkMeetingExists.join_url || checkMeetingExists.join_url.trim() === "") 
                {
                    return res.status(200).json({
                        status: 0,
                        message: "The mentor has not yet started the meeting. You will be notified once the mentor joins.",
                    });
                }
                else
                {
                    const returnResponse = {
                        topic:checkMeetingExists.topic,
                        start_url:checkMeetingExists.start_url,
                        join_url:checkMeetingExists.join_url,
                    }
                    // Respond with success message
                    return res.json({ status: 1, message: 'Zoom Meeting links created',data:returnResponse, checkMeetingExists });
                }
                // return res.status(200).json({
                //     status: 0,
                //     message: "Only Mentor can create meeting links",
                // });
            }
            console.log("checkMeetingExists");
            if (checkMeetingExists.join_url && checkMeetingExists.join_url.trim() !== "") {
         
                console.log("11111111111111");
                const returnResponse = {
                    topic:checkMeetingExists.topic,
                    start_url:checkMeetingExists.start_url,
                    join_url:checkMeetingExists.join_url,
                }
                // Respond with success message
                return res.json({ status: 1, message: 'Zoom Meeting links created',data:returnResponse, checkMeetingExists });
            }
           

            
            
            let videoenabled = checkMeetingExists.mode == "videoCall" ? true : false;
            console.log("videoenabled",videoenabled);

            const localDateTimeString = `${dateMeeting}T${timeMeeting}:00`;
            const localDateTime = new Date(
                new Date(localDateTimeString).toLocaleString("en-US", { timeZone: process.env.ZOOM_TIMEZONE })
            );

            const utcDateTime = localDateTime.toISOString();

            console.log("localDateTime (IST):", localDateTime); // Indian Standard Time
            console.log("utcDateTime (UTC):", utcDateTime); // Convert to UTC for Zoom API

            
            

            const zoomAccessToken = await generateZoomAccessToken();
            const meetingPayload = {
                topic: checkMeetingExists.meetingTitle,
                type: 2,
                start_time: utcDateTime, // Ensure UTC time here
                duration: slotDuration, // Duration in minutes //default 30
                timezone: "UTC",
                settings: {
                    join_before_host: false,
                    waiting_room: true, // Enable waiting room
                    approval_type: 0, // Manual approval for registrants
                    enforce_login: true,
                    registrants_email_notification: false,
                    audio: "voip", // Computer audio only
                    video: false, // Disable participant video
                    disable_video: false // Disable participant video
                }
            };
            const response = await fetch(
                `https://api.zoom.us/v2/users/me/meetings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${zoomAccessToken}`,
                    },
                    body: JSON.stringify(meetingPayload),
                }
            );
    
            const jsonResponse = await response.json();
            const zoomMeetingId = jsonResponse.id;
            const registrants = [
                { email: myProfile.email, first_name: myProfile.fullName, last_name: "" },
                { email: profile.email, first_name: profile.fullName, last_name: "" }
            ];
            
            for (const registrant of registrants) {
                await fetch(`https://api.zoom.us/v2/meetings/${zoomMeetingId}/registrants`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${zoomAccessToken}`
                    },
                    body: JSON.stringify(registrant)
                });
            }
            const returnResponse = {
                topic:jsonResponse.topic,
                start_url:jsonResponse.start_url,
                join_url:jsonResponse.join_url,
            }

            const filter = { _id: meetingId };
            let update = {};
            update.status = 1;
            update.start_url = jsonResponse.start_url;
            update.join_url = jsonResponse.join_url;
            update.zoomMeetingId = zoomMeetingId;
            const updateBooking = await BookMeetingsModel.findOneAndUpdate(filter, { $set: update }, { new: true });

            //pushnotification
            if (myProfile.userType == 1) {

            }
            const userToNotification = await UsersModel.findOne(
                { cognitoUserId: profile.cognitoUserId}
            );

            if (userToNotification) {
                let notificationSave = {};
                if (Array.isArray(userToNotification.deviceToken) && userToNotification.deviceToken.length > 0) {
                    let payload = {
                        notification: {
                            title: "Meeting Start",
                            body: "The mentor has started the meeting. Please join now.",
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

            

            // Respond with success message
            return res.json({ status: 1, message: 'Zoom Meeting links created',data:returnResponse, checkMeetingExists });
        } catch (error) {
            console.error('Zoom Meeting error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    webhookzoom: async (req, res) => {
        const { event, payload } = req.body;
        console.log(`Webhook received: ${event}`);
    
        // Zoom URL validation check
        if (event === "endpoint.url_validation") {
            console.log("Validating Zoom webhook...");
            console.log("Headers:", req.headers);
            console.log("Payload:", JSON.stringify(req.body, null, 2));

            const response = { plainToken: req.body.payload.plainToken }; // Corrected
            console.log("Response Sent:", JSON.stringify(response));

            return res.json(response);
        }
    
        else if (event === "meeting.ended") {
            console.log(`Webhook meeting.ended`);
            const meetingId = payload.object.id;
            let checkBooking = await BookMeetingsModel.aggregate([
                { $match: { zoomMeetingId: meetingId } },
                { $lookup: { from: "users", localField: "cognitoUserId", foreignField: "cognitoUserId", as: "menteeData" } },
                { $lookup: { from: "users", localField: "cognitoUserIdMenter", foreignField: "cognitoUserId", as: "mentorData" } },
                { $unwind: { path: "$menteeData", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$mentorData", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1, cognitoUserId: 1, cognitoUserIdMenter: 1, zoomMeetingId: 1, meetingTitle: 1, date: 1,
                        slot: 1, mode: 1, status: 1,
                        menteeData: { cognitoUserId: 1, email: 1, fullName: 1, deviceToken: 1 },
                        mentorData: { cognitoUserId: 1, email: 1, fullName: 1, deviceToken: 1 }
                    }
                }
            ]);
    
            let meetingstatus = [0, 1];
            if (checkBooking.length > 0) {
                console.log(`Meeting found`);
                let checkBookingSingle = checkBooking[0];
    
                if (meetingstatus.includes(checkBookingSingle.status)) {
                    console.log(`Meeting started`);
                    const filter = { zoomMeetingId: meetingId };
                    let update = { status: 2 };
                    const updateBooking = await BookMeetingsModel.findOneAndUpdate(filter, { $set: update }, { new: true });
    
                    // Send notifications (mentor & mentee)
                    let notifications = [
                        {
                            toUser: checkBookingSingle.mentorData,
                            fromUser: checkBookingSingle.menteeData,
                            message: `How was your recent session with ${checkBookingSingle.menteeData.fullName.split(' ')[0]}? Share your feedback!`
                        },
                        {
                            toUser: checkBookingSingle.menteeData,
                            fromUser: checkBookingSingle.mentorData,
                            message: `How was your recent session with ${checkBookingSingle.mentorData.fullName.split(' ')[0]}? Share your feedback!`
                        }
                    ];
    
                    for (const notif of notifications) {
                        let notificationSave = await NotificationModel.create({
                            fromCognitoId: notif.fromUser.cognitoUserId,
                            toCognitoId: notif.toUser.cognitoUserId,
                            requestId: checkBookingSingle._id,
                            tableName: "book_meetings",
                            message: notif.message,
                            type: "meeting",
                            isTakeAction: 1,
                        });
    
                        if (Array.isArray(notif.toUser.deviceToken) && notif.toUser.deviceToken.length > 0) {
                            let payload = {
                                notification: { title: "End Meeting", body: notif.message, content_available: "true" },
                                data: { "data": JSON.stringify(notificationSave) }
                            };
                            await PushNotification({ registrationToken: notif.toUser.deviceToken, payload });
                        }
                    }
                }
            }
        }
    
        res.status(200).send("Webhook received");
    },
    
    createMeetingTest: async (req, res) => {
        
        //const cognitoUserIdMy = "a3f458d2-10a1-70cc-d6e3-0550a9c75624"; 

        try {
            const { mode } = req.body;
            
            let date = "2025-01-24";
            let slot = "11:30";
            let slotDuration = 30;
            
            const slotMoment = moment(`${date} ${slot}`, "YYYY-MM-DD HH:mm");
            const slotStart = slotMoment.subtract(slotDuration, 'minutes').format("HH:mm"); // 0 minute before
            //const slotEnd = slotMoment.add(slotDuration, 'minutes').format("HH:mm"); // Reset to original time
            const slotEnd = slot

            console.log("slotStart",slotStart);
            console.log("slotEnd",slotEnd);
          
            const dateMeeting = date;
            console.log("dateMeeting",dateMeeting);
            const timeMeeting = slot;
            console.log("timeMeeting",timeMeeting);
            
            let videoenabled = mode == "videoCall" ? true : false;
            console.log("videoenabled",videoenabled);

            const localDateTimeString = `${dateMeeting}T${timeMeeting}:00`;
            const localDateTime = new Date(
                new Date(localDateTimeString).toLocaleString("en-US", { timeZone: process.env.ZOOM_TIMEZONE })
            );

            const utcDateTime = localDateTime.toISOString();

            console.log("localDateTime (IST):", localDateTime); // Indian Standard Time
            console.log("utcDateTime (UTC):", utcDateTime); // Convert to UTC for Zoom API
            // if (new Date(utcDateTime) < new Date()) {
            //    return res.json({ status: 0, message: "Start time must be in the future. Please select a valid date and time." });
            // }

            
            

            const zoomAccessToken = await generateZoomAccessToken();
            const meetingPayload = {
                topic: "Private Meeting",
                type: 2, // Scheduled Meeting
                start_time: new Date().toISOString(),
                duration: 60, // 60 minutes
                timezone: "Asia/Kolkata",
                password: "secure123", // Add passcode for security
                settings: {
                    host_video: true,
                    participant_video: false,
                    waiting_room: true, // Enable Waiting Room
                    approval_type: 0, // No automatic approval
                    join_before_host: false, // Disable join before host
                    mute_upon_entry: true, // Mute participants on entry
                    use_pmi: false // Generate a new meeting ID
                }
            };
            const response = await fetch(
                `https://api.zoom.us/v2/users/me/meetings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${zoomAccessToken}`,
                    },
                    body: JSON.stringify(meetingPayload),
                }
            );
    
            const jsonResponse = await response.json();
            const zoomMeetingId = jsonResponse.id;
            const registrants = [
                { email: "kuldeep@yopmail.com", first_name: "kuldeep", last_name: "" },
                { email: "priya@yopmail.com", first_name: "priya", last_name: "" }
            ];
            
            for (const registrant of registrants) {
                await fetch(`https://api.zoom.us/v2/meetings/${zoomMeetingId}/registrants`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${zoomAccessToken}`
                    },
                    body: JSON.stringify(registrant)
                });
            }
            const returnResponse = {
                topic:jsonResponse.topic,
                start_url:jsonResponse.start_url,
                join_url:jsonResponse.join_url,
            }
            // Respond with success message
            return res.json({ status: 1, message: 'Zoom Meeting links created',data:returnResponse });
        } catch (error) {
            console.error('Zoom Meeting error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },
    
    
   
    

};

module.exports = meetingController;
