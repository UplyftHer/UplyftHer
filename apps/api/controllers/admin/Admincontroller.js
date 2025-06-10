
const AWS = require('aws-sdk');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UsersModel = require('../../models/UsersModel');
const AdminInvitationCode = require('../../models/admin/AdminInvitationCode');
const { sendEmail } = require('../../middlewares/mailer.js'); 
const SavedProfilesModel = require('../../models/SavedProfiles');
const ConnectedUserModel = require('../../models/ConnectedUserModel');
const UnConnectedUserModel = require('../../models/UnConnectedUserModel');
const NotificationModel = require('../../models/NotificationModel');
const ChatModel = require('../../models/ChatModel');
const AvailabilityModel = require('../../models/AvailabilityModel');
const BookMeetingsModel = require('../../models/BookMeetingsModel');
const feedbackModel = require('../../models/feedbackModel');
const interactedUserModel = require('../../models/interactedUserModel');
const BlockedUsers = require('../../models/BlockedUsers.js');
const PrivacyPolicyModel = require('../../models/admin/PrivacyModel');
const TermsModel = require('../../models/admin/TermsModel');
const AboutUsModel = require('../../models/admin/AboutUsModel')

AWS.config.update({
    region: process.env.S3_REGION, // Set your AWS region
    accessKeyId: process.env.S3_ACCESS_KEY, // Your access key
    secretAccessKey: process.env.S3_SECRET_KEY, // Your secret key
});

const cognito = new AWS.CognitoIdentityServiceProvider();



// Helper function to calculate the SECRET_HASH
function getSecretHash(username) {
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    // Generate the HMAC-SHA256 hash of the username and clientId using the clientSecret
    return crypto
        .createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


const AdminController = {
   
        // Signup API
        signup: async (req, res) => {
            
            const { email , invitationCode, registerusercount} = req.body;
            // const { email, password, invitationCode,registerBy} = req.body;
           
    
            // Calculate the SECRET_HASH using the getSecretHash function
            //const secretHash = getSecretHash(email);
    
            // const params = {
            //     ClientId: process.env.COGNITO_CLIENT_ID,
            //     //SecretHash: secretHash, // Include the calculated SECRET_HASH
            //     Username: email,
            //     Password: password,
            //     UserAttributes: [
            //         { Name: 'email', Value: email } // Add email as a user attribute
            //     ]
            // };
    
            try {
                    // Check email in both models simultaneously using Promise.all
                    const [userCheck, adminCheck] = await Promise.all([
                    UsersModel.findOne({ email: email }, { email: 1 }),
                    AdminInvitationCode.findOne({ email: email }, { email: 1 })
                    ]);

                    // If either email is found, return the message
                    if (userCheck && adminCheck) {
                    return res.json({
                    status: 0,
                    message: "Email already exists!"
                    });
                    }
                
                // Call Cognito's signUp function
              //const data = await cognito.signUp(params).promise();
              //  let invitationCodeUser= generateRandomString(12);
                const userData = new AdminInvitationCode({
                    //cognitoUserId: data.UserSub,
                    //cognitoUserId: "123456789",
                    email,
                    invitationCode,
                    registerusercount
                });

                // console.log(userData);
               // await sendInvitationEmail(email, invitationCode);
                await userData.save();
                
                res.status(201).json({ message: 'User created successfully, please verify your email', userData });
            } catch (error) {
                //res.status(500).json({ message: 'Error during sign-up', error });
                return res.json({ status: 0, message: error.message });
            }
        },
    
        // // Confirm Signup (Verification API)
        // confirmSignup: async (req, res) => {
        //     const { email, confirmationCode } = req.body;
    
        //     const secretHash = getSecretHash(email); // Calculate the SECRET_HASH
    
        //     const params = {
        //         ClientId: process.env.COGNITO_CLIENT_ID,
        //         //SecretHash: secretHash, // Include the SECRET_HASH
        //         Username: email,
        //         ConfirmationCode: confirmationCode // The OTP sent to user's email
        //     };
    
        //     try {
        //         // Confirm the user's signup with the confirmation code
        //         await cognito.confirmSignUp(params).promise();
    
        //         // Update the user in your database (if needed)
        //         const filter = { email: email };
        //         const updateData = { isVerified: 1 }; // Example of marking the user as verified
        //         await UsersModel.updateOne(filter, updateData, { runValidators: true });
        //         const user = await UsersModel.findOneAndUpdate(filter, updateData, { new: true });
        //         //const token = jwt.sign({ username: user.cognitoUserId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
        //         // let respnse = {
        //         //     accessToken:token,
        //         //     isCreateProfile:user.isCreateProfile,
        //         // }
                
        //         return res.json({ status: 1, message: 'User confirmed successfully', data: user });
        //     } catch (error) {
        //         //res.status(500).json({ message: 'Error during confirmation', error });
        //         return res.json({ status: 0, message: error.message });
        //     }
        // }, 
        // resendConfirmationCode: async (req, res) => {
        //     const { email } = req.body;
    
        //     const secretHash = getSecretHash(email); // Calculate the SECRET_HASH
    
        //     const params = {
        //         ClientId: process.env.COGNITO_CLIENT_ID,
        //         Username: email
        //     };
    
        //     try {
        //         // Resend the confirmation code
        //         await cognito.resendConfirmationCode(params).promise();
        //         return res.json({ status: 1, message: 'Confirmation code resent successfully', data:{email}});
        //         //res.status(200).json({ message: 'Confirmation code resent successfully' });
        //     } catch (error) {
        //         //res.status(500).json({ message: 'Error resending confirmation code', error });
        //         return res.json({ status: 0, message: error.message });
        //     }
        // },
        // Get All Users without Pagination
        getAllUsers: async (req, res) => {
        const { status, role, search } = req.query; 

        try {
            const filter = {};
            if (status) filter.status = status;
            if (role) filter.role = role;
            if (search) {
            const escapedSearch = escapeRegExp(search);
            const regex = new RegExp(escapedSearch, 'i');
            filter.$or = [
                { name: { $regex: regex } },
                { email: { $regex: regex } },
            ];
            }

            const users = await UsersModel.find(filter);

            res.status(200).json({
            status: 1,
            users,
            totalUsers: users.length, 
            });
        } catch (error) {
            res.json({
            status: 0,
            message: 'Error fetching users',
            error: error.message,
            });
        }
        },
  
// Update User Status API
// Update User Status API
updateUserStatus: async (req, res) => {
    const { userId, newStatus } = req.body; // newStatus can be '0' (Inactive), '1' (Active), or '2' (Blocked)
    
   
    try {
        // Find user and update their status
        const user = await UsersModel.findById(userId);
        if (!user) {
            return res.json({
                status: 0,
                message: 'User not found'
            });
        }

        
        user.isActive = newStatus;
        await user.save();

        res.status(200).json({ 
            status: 1, 
            message: 'User status updated successfully', 
            user 
        });
    } catch (error) {
        return res.json({
            status: 0,
            message: 'Error updating status',
            error: error.message
        });
    }
},
    // Send Congratulations Email
    sendCongratulationsEmail: async (req, res) => {
   
    const { email, invitationCode } = req.body;

    try {
      // Email content (instructions)
      const instructions = `
        Hello,

        Welcome to the Uplyfther family app! Here are your next steps:
        1. Download the app from the App Store or Google Play.
        2. Log in with your email: ${email} with the invitation code: ${invitationCode}.
        3. Follow the on-screen instructions to complete your profile.

        We're excited to have you on board!

        Best regards,
        The Team at Uplyfther
        `;
  
      // Send the "Congratulations and Welcome" email
      await sendEmail(email, 'Congratulations and Welcome!', instructions);
      console.log('Congratulations email sent successfully');
      res.status(200).json({ status: 1, message: 'Congratulations email sent successfully.' });
  
    } catch (error) {
      console.error('Error sending congratulations email:', error);
      res.status(500).json({ status: 0, message: 'Failed to send congratulations email.' });
    }  
},

    
    // Delete User API
    deleteUser: async (req, res) => {
        
       
        const { cognitoUserId } = req.params; 
        //console.log(cognitoUserId);
        

        try {
            const user = await UsersModel.findOne({ cognitoUserId });
            console.log(user);
            
            if (!user) {
                return res.status(404).json({ status: 0, message: `User not found with ID: ${cognitoUserId}` });
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
           
            
                    return res.json({
                        status: 1,
                        message: 'User deleted successfully'
                    });
                } catch (error) {
                    return res.json({
                        status: 0,
                        message: 'Error deleting user',
                        error: error.message
                    });
                }
            },

         getAdminContent : async (req, res) => {
                const { type } = req.body;
                try {
                    let content;
                    if (type === 'privacy') {
                        content = await PrivacyPolicyModel.findOne();
                    } else if (type === 'terms') {
                        content = await TermsModel.findOne();
                    } else if (type === 'about') {
                        content = await AboutUsModel.findOne();
                    } else {
                        return res.status(200).json({
                            status: 0,
                            message: 'Invalid type. Use "privacy", "terms", or "about".'
                        });
                    }
            
                    if (!content) {
                        return res.status(200).json({
                            status: 0,
                            message: 'Content not found.'
                        });
                    }
                    //console.log(content,"hello");
                    
            
                    return res.status(200).json({
                        status: 1,
                        message: 'Content fetched successfully',
                        data: content.content || ''
                    });
            
                } catch (error) {
                    return res.status(500).json({
                        status: 0,
                        message: 'Error fetching content',
                        error: error.message
                    });
                }
            }


            };

module.exports = AdminController;

