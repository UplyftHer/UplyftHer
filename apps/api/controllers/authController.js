const AWS = require('aws-sdk');
const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');
const DomainModel = require('../models/admin/DomainManagerModel');
const AdminInvitationCode = require('../models/admin/AdminInvitationCode');
const CountriesCities= require("../utils/countriescities.json");
const OrganizationsModel = require('../models/OrganizationsModel.js');
const validator = require('validator');

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

async function uploadToS3(filePath) {
    // Extract the file name from the file path
    const fileName = path.basename(filePath);

    // Read content from the file
    const fileContent = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const params = {
        Bucket: S3_BUCKET_NAME, // Replace with your bucket name
        Key: `Uploads/Images/${fileName}`, // File name in the S3 bucket
        Body: fileContent,
        ContentType: 'image/jpeg', // Set the Content-Type here
        ContentDisposition: 'inline', // Set Content-Disposition to "inline"
    };

    // Uploading file to S3
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.error("Error uploading to S3:", err);
                return reject(err);
            }
            console.log("File uploaded successfully:", data.Location);
            //resolve(data.Location); // Return the S3 URL
            resolve(`Uploads/Images/${fileName}`); // Return the S3 URL
        });
    });
}


async function uploadLinkedInProfilePic(linkedinProfilePicUrl) {
    try {
        // Step 1: Download the LinkedIn image
        const response = await axios({
            url: linkedinProfilePicUrl,
            method: 'GET',
            responseType: 'arraybuffer', // Ensure we get binary data
        });

        // Generate a temporary file path
        const currentDate = Date.now();
        const fileName = `LinkedIn_${currentDate}.jpg`; // Use LinkedIn as prefix for clarity
        const tempFilePath = path.join(__dirname, '../Uploads/Images', fileName);

        // Ensure the folder exists
        fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });

        // Save the image temporarily
        fs.writeFileSync(tempFilePath, response.data);

        // Step 2: Upload the file to S3
        const imageUrl = await uploadToS3(tempFilePath);

        // Step 3: Clean up the temporary file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        return imageUrl; // Return the S3 URL
    } catch (error) {
        console.error('Error uploading LinkedIn profile picture:', error);
        throw error;
    }
}



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
const generateRandomString = (length = 12) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };


  const generateRandomStringLinkedin = (length = 8) => {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (length < 8) {
        throw new Error('Password length must be at least 8 characters.');
    }

    const getRandomIndex = (max) => crypto.randomInt(0, max);

    let result = '';
    result += upperCase[getRandomIndex(upperCase.length)];
    result += lowerCase[getRandomIndex(lowerCase.length)];
    result += numbers[getRandomIndex(numbers.length)];
    result += specialCharacters[getRandomIndex(specialCharacters.length)];

    const allCharacters = upperCase + lowerCase + numbers + specialCharacters;

    for (let i = result.length; i < length; i++) {
        result += allCharacters[getRandomIndex(allCharacters.length)];
    }

    // Secure shuffle with valid range
    result = result
        .split('')
        .map(value => ({ value, sort: crypto.randomInt(0, 1 << 24) })) // safe shuffle
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .join('');

    return result;
};



async function getAccessToken(code) {
    try {
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            }
        });

        const accessToken = response.data.access_token;
        //console.log('Access Token:', accessToken);

        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    }
}



// Controller for handling authentication
const authController = {
    // Resend Confirmation Code API (optional)
    getCities: async (req, res) => {
        try {
            const { countryId } = req.body;
            //const conId = parseInt(countryId);
            const conId = countryId;
            let citieslist = {};
            //const country = CountriesCities.find(country => country.id === conId);
            const country = CountriesCities.find(country => country.iso2 === conId);
            if(country)
            {
                citieslist = country;
            }
            return res.json({ status: 1, message: 'Success', data:citieslist});
        } catch (error) {
            return res.json({ status: 0, message: error.message });
        }
    },
    getOrganizations: async (req, res) => {
        try {
            const { search } = req.body;
            
            if(!search)
            {
                return res.json({ status: 1, message: 'Success', data: [] });
            }
            else
            {
                const searchCondition = search
                ? { organizationName: { $regex: search, $options: "i" } } // Case-insensitive partial match
                : {}; // Empty filter returns all records

            
                const organizationslist = await OrganizationsModel.find(searchCondition);

                return res.json({ status: 1, message: 'Success', data: organizationslist });
            }
                

        } catch (error) {
            return res.json({ status: 0, message: error.message });
        }
    },
    
    // Signup API
    signup: async (req, res) => {
        const { password, invitationCode, deviceToken } = req.body;
        let { email } = req.body;
        email = email.toLowerCase();
        // Calculate the SECRET_HASH using the getSecretHash function
        //const secretHash = getSecretHash(email);
        // Example validation
        if (!validator.isEmail(email)) {
            return res.json(
                { status: 0, message: "Invalid email format." },
            );
        }

        else if (typeof invitationCode !== 'string' || !/^[A-Za-z0-9]{12}$/.test(invitationCode)) {
            return res.json(
                { status: 0, message: "Invalid invitation code format." },
            );
        }

        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            //SecretHash: secretHash, // Include the calculated SECRET_HASH
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email } // Add email as a user attribute
            ]
        };

        try {
            var checkEmail = await UsersModel.findOne({ email: email},{email:1,isVerified:1,cognitoUserId:1});
            if (checkEmail?.isVerified == 1) {
                return res.json(
                    { status: 0, message: "Email already exists!" },
                );
            } 
            //console.log("checkEmail",checkEmail);
            if(checkEmail?.isVerified == 0)
            {
                const params = {
                    UserPoolId: process.env.COGNITO_USER_POOL_ID,
                    Username: checkEmail.cognitoUserId,
                };
                await cognito.adminDeleteUser(params).promise();
                await UsersModel.deleteOne({ cognitoUserId:checkEmail.cognitoUserId });
            }
            
           
            let checkAdminInvitationCode = await AdminInvitationCode.findOne({email,invitationCode});
           
            let adminInvitationCode = 0;
            if(checkAdminInvitationCode)
            {
                if(checkAdminInvitationCode?.registerusercount >= process.env.INVITATION_CODE_LIMIT_ADMIN)
                {
                    return res.json({
                        status: 0,
                        message: "Invitation Code limit exceed!",
                    });
                }
                else
                {
                    adminInvitationCode = 1;
                }
                
            }
            //z
            if(adminInvitationCode === 0)
            {
                var checkInvitationCode = await UsersModel.find({ myInvitationCode: invitationCode},{invitationCode:1});
                if (checkInvitationCode.length === 0) {
                    return res.json({
                        status: 0,
                        message: "Invalid invitation Code!",
                    });
                }
                var checkInvitationCodeUsed = await UsersModel.find({ invitationCode: invitationCode},{invitationCode:1});
                if (checkInvitationCodeUsed.length >= process.env.INVITATION_CODE_LIMIT) {
                    return res.json(
                        { status: 0, message: "Invitation Code limit exceed!" },
                    );
                } 
            }
            
            
            // Call Cognito's signUp function
            const data = await cognito.signUp(params).promise();
            let invitationCodeUser= generateRandomString(12);
            let emailDomainVerified = 0;
            const emailDomain = email.substring(email.indexOf("@"));
            const domainExists = await DomainModel.findOne({ name: emailDomain, status:1 });
            if (domainExists) {
                emailDomainVerified = 1;
            }

            const userData = new UsersModel({
                cognitoUserId: data.UserSub,
                //cognitoUserId: "123456789",
                email,
                invitationCode,
                myInvitationCode:invitationCodeUser,
                deviceToken,
                emailDomainVerified
            });

            await userData.save();

            if(adminInvitationCode === 1)
            {
                checkAdminInvitationCode.registerusercount = 1;
                checkAdminInvitationCode.save();
            }
            //res.status(201).json({ message: 'User created successfully, please verify your email', userData });
            const accessTokenRes = jwt.sign({username:data.sub},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_TIME});
            let response = {
                email,
                accessToken:accessTokenRes

            }
            return res.json({ status: 1, message: 'User created successfully, please verify your email',data: response});
        } catch (error) {
            //res.status(500).json({ message: 'Error during sign-up', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    // Confirm Signup (Verification API)
    confirmSignup: async (req, res) => {
        const {confirmationCode } = req.body;
        let { email } = req.body;
        email = email.toLowerCase();

        const secretHash = getSecretHash(email); // Calculate the SECRET_HASH

        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            //SecretHash: secretHash, // Include the SECRET_HASH
            Username: email,
            ConfirmationCode: confirmationCode // The OTP sent to user's email
        };

        try {
            // Confirm the user's signup with the confirmation code
            await cognito.confirmSignUp(params).promise();

            // Update the user in your database (if needed)
            const filter = { email: email };
            const updateData = { isVerified: 1 }; // Example of marking the user as verified
            await UsersModel.updateOne(filter, updateData, { runValidators: true });
            const user = await UsersModel.findOneAndUpdate(filter, updateData, { new: true });
            const token = jwt.sign({ username: user.cognitoUserId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
            let respnse = {
                accessToken:token,
                //isCreateProfile:user.isCreateProfile,
            }
            return res.json({ status: 1, message: 'User confirmed successfully', data: respnse });
        } catch (error) {
            //res.status(500).json({ message: 'Error during confirmation', error });
            return res.json({ status: 0, message: error.message });
        }
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body; // Get refresh token from request body
    
        const params = {
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken
            }
        };
    
        try {
            // Use refresh token to get a new access token
            const data = await cognito.initiateAuth(params).promise();
            const accessToken = data.AuthenticationResult.AccessToken;
            const decodedToken = jwt.decode(accessToken);
            const accessTokenRes = jwt.sign({username:decodedToken.sub, accessToken},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_TIME});
            return res.json({
                status: 1,
                message: 'New access token generated',
                accessToken: accessTokenRes
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            return res.json({ status: 0, message: error.message });
        }
    },

    // Login API
    login: async (req, res) => {
        const { password, deviceToken } = req.body;
        let { email } = req.body;
        email = email.toLowerCase();
    
        //const secretHash = getSecretHash(email); // Calculate the SECRET_HASH
    
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                //SECRET_HASH: secretHash // Include the SECRET_HASH
            }
        };
    
        try {
            // Call Cognito's initiateAuth function
            const data = await cognito.initiateAuth(params).promise();
            const accessToken = data.AuthenticationResult.AccessToken;
            const refreshToken = data.AuthenticationResult.RefreshToken;
            //console.log("accessToken",accessToken);
            const decodedToken = jwt.decode(accessToken);
            const accessTokenRes = jwt.sign({username:decodedToken.sub, accessToken},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_TIME});
            //const accessToken = data.AuthenticationResult.AccessToken; // Get the access token

           
            const user = await UsersModel.findOne({cognitoUserId:decodedToken.sub}); 
            if (!user) {
                console.log('User not found');
                return res.json({ status: 0, message: 'User not found' });
                //return res.status(404).json({ status: 0, message: 'User not found' });
            }
            else if (user.isActive == 0) {
                console.log('Your account is temporarily restricted.');
                return res.json({ status: 0, message: 'Your account is temporarily restricted.' });
                
            }

            const filter = { cognitoUserId: decodedToken.sub };
            console.log("filter",filter);
            const update = {
               $addToSet: { deviceToken } // Ensures unique values in the array
            };
            const profile = await UsersModel.findOneAndUpdate(filter, update, { new: true });
            //res.status(200).json({ token: accessToken }); // Return the access token directly
            let respnse = {
                accessToken:accessTokenRes,
                refreshToken: refreshToken,
                isCreateProfile:profile.isCreateProfile,
            }
            return res.json({ status: 1, message: 'User login successfully',data: respnse});
        } catch (error) {
            console.error('Login error:', error.message); // Log the full error
            //res.status(500).json({ message: 'Error during login', error: error.message }); // Send error message back
            return res.json({ status: 0, message: error.message });
        }
    },
    // Resend Confirmation Code API (optional)
    resendConfirmationCode: async (req, res) => {
        let { email } = req.body;
        email = email.toLowerCase();
        const checkEmail = await UsersModel.findOne({ email: email }, { email: 1, registerWith:1 });
        if (!checkEmail) {
            return res.json({ status: 0, message: "Email not exists!" });
        }

        if(checkEmail.registerWith == 1)
        {
            return res.json({ status: 0, message: "This email registered with Linkedin!" });
        }

        const secretHash = getSecretHash(email); // Calculate the SECRET_HASH

        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            //SecretHash: secretHash, // Include the SECRET_HASH
            Username: email
        };

        try {
            // Resend the confirmation code
            await cognito.resendConfirmationCode(params).promise();
            return res.json({ status: 1, message: 'Confirmation code resent successfully', data:{email}});
            //res.status(200).json({ message: 'Confirmation code resent successfully' });
        } catch (error) {
            //res.status(500).json({ message: 'Error resending confirmation code', error });
            return res.json({ status: 0, message: error.message });
        }
    },
    forgotPassword: async (req, res) => {
        let { email } = req.body;
        email = email.toLowerCase();

        const checkEmail = await UsersModel.findOne({ email: email }, { email: 1, registerWith:1 });
        if (!checkEmail) {
            return res.json({ status: 0, message: "Email not exists!" });
        }

        if(checkEmail.registerWith == 1)
        {
            return res.json({ status: 0, message: "This email registered with Linkedin!" });
        }

        
    
        //const secretHash = getSecretHash(email); // Calculate the SECRET_HASH
    
        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            //SecretHash: secretHash, // Include the SECRET_HASH
            Username: email
        };
    
        try {
            // Trigger the forgot password flow
            await cognito.forgotPassword(params).promise();
            //res.status(200).json({ message: 'Password reset code sent to your email' });
            return res.json({ status: 1, message: 'Password reset code sent to your email',data:{email}});
        } catch (error) {
            console.error('Forgot password error:', error);
            //res.status(500).json({ message: 'Error during password reset process', error: error.message });
            return res.json({ status: 0, message: error.message });
        }
    },
    confirmForgotPassword: async (req, res) => {
        const {confirmationCode, newPassword } = req.body;
        let { email } = req.body;
        email = email.toLowerCase();

        const checkEmail = await UsersModel.findOne({ email: email }, { email: 1, registerWith:1 });
        if (!checkEmail) {
            return res.json({ status: 0, message: "Email not exists!" });
        }

        if(checkEmail.registerWith == 1)
        {
            return res.json({ status: 0, message: "This email registered with Linkedin!" });
        }
    
        //const secretHash = getSecretHash(email); // Calculate the SECRET_HASH
    
        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            //SecretHash: secretHash, // Include the SECRET_HASH
            Username: email,
            ConfirmationCode: confirmationCode, // The code sent to the user's email
            Password: newPassword
        };
    
        try {
            // Confirm the password reset process
            await cognito.confirmForgotPassword(params).promise();
            //res.status(200).json({ message: 'Password reset successfully' });
            return res.json({ status: 1, message: 'Password reset successfully'});
        } catch (error) {
            console.error('Confirm forgot password error:', error);
            //res.status(500).json({ message: 'Error during password reset confirmation', error: error.message });
            return res.json({ status: 0, message: error.message });
        }
    },

    signupWithLinkedIn: async (req, res) => {
        const { linkedinAccessToken, invitationCode, deviceToken, type } = req.body;
    
        try {
            if(!linkedinAccessToken || !type)
            {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            if(type == "signup")
            {
                if(typeof invitationCode !== 'string' || !/^[A-Za-z0-9]{12}$/.test(invitationCode))
                {
                    return res.status(200).json({
                        status: 0,
                        message: "All fields are required",
                    });
                }
            }
            let accessToken;
            try {
             accessToken = await getAccessToken(linkedinAccessToken);
            }
            catch (error) {
                return res.json({ status: 0, message: error.message });
            }
            //let accessToken = linkedinAccessToken;
            //console.log("accessTokenaccessToken",accessToken);
            
            // Fetch LinkedIn user profile
            const linkedinProfile = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
             //console.log("linkedinProfile",linkedinProfile);

            // const linkedinEmail = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // });

            //console.log("linkedinEmail",linkedinEmail);
           
           
             

            
            if (linkedinProfile.status === 200 && linkedinProfile.statusText === 'OK') {
                // Extract the profile data
                const profileData = linkedinProfile.data;
                const email = profileData.email;
                const fullName = profileData.name;

                const linkedinProfilePicUrl = profileData.picture; // LinkedIn picture URL

                

               
                
                // Check if email exists in the database
                const checkEmail = await UsersModel.findOne({ email: email }, { email: 1, isCreateProfile:1, cognitoUserId:1 });
                if (checkEmail) {
                    //return res.json({ status: 0, message: "Email already exists!" });
                    const filter = { cognitoUserId: checkEmail.cognitoUserId };
                    const update = {
                       $addToSet: { deviceToken }
                    };
                    const profile = await UsersModel.findOneAndUpdate(filter, update, { new: true });
                    
                    const accessTokenRes = jwt.sign({username:checkEmail.cognitoUserId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_TIME});
                    let response = {
                        accessToken:accessTokenRes,
                        isCreateProfile:checkEmail.isCreateProfile,
                        linkedinProfileData:profileData
                    }
                    return res.json({ status: 1, message: 'User signin successfully via LinkedIn', data: response });

                }
                else
                {
                    if(typeof invitationCode !== 'string' || !/^[A-Za-z0-9]{12}$/.test(invitationCode))
                    {
                        return res.json({ status: 0, message: "We couldn't find an account associated with your credentials. Please create an account before proceeding." });
                    }
                    // Check invitation code
                    let checkAdminInvitationCode = await AdminInvitationCode.findOne({email,invitationCode});
                    let adminInvitationCode = 0;
                    if(checkAdminInvitationCode)
                    {
                        if(checkAdminInvitationCode?.registerusercount >= process.env.INVITATION_CODE_LIMIT_ADMIN)
                        {
                            return res.json({
                                status: 0,
                                message: "Invitation Code limit exceed!",
                            });
                        }
                        else
                        {
                            adminInvitationCode = 1;
                        }
                        
                    }
                    if(adminInvitationCode === 1)
                    {
                        const checkInvitationCode = await UsersModel.find({ myInvitationCode: invitationCode }, { invitationCode: 1 });
                        if (checkInvitationCode.length === 0) {
                            return res.json({ status: 0, message: "Invalid invitation Code!" });
                        }

                        const checkInvitationCodeUsed = await UsersModel.find({ invitationCode: invitationCode }, { invitationCode: 1 });
                        if (checkInvitationCodeUsed.length >= process.env.INVITATION_CODE_LIMIT) {
                            return res.json({ status: 0, message: "Invitation Code limit exceeded!" });
                        }
                    }
                    
                    

                    // Prepare Cognito signup parameters with email verified
                    let password = generateRandomStringLinkedin(8);
                    const params = {
                        //ClientId: process.env.COGNITO_CLIENT_ID,
                        UserPoolId: process.env.COGNITO_USER_POOL_ID,
                        Username: email,
                        TemporaryPassword: password, // Random password since login is via LinkedIn
                        UserAttributes: [
                            { Name: 'email', Value: email },
                            { Name: 'email_verified', Value: 'true' } // Mark email as verified
                        ]
                    };
                    // Call Cognito's signUp function
                    //const data = await cognito.signUp(params).promise();
                    const data = await cognito.adminCreateUser(params).promise();
                    console.log("data",data);

                    // Step 2: Set a permanent password (optional)
                    await cognito
                    .adminSetUserPassword({
                    UserPoolId: process.env.COGNITO_USER_POOL_ID,
                    Username: email,
                    Password: password, // Permanent password
                    Permanent: true,
                    })
                    .promise();

                    const profilePicUrl = await uploadLinkedInProfilePic(linkedinProfilePicUrl);
                    //console.log("profilePicUrl",profilePicUrl);
            
                    //Save user in the database
                    let invitationCodeUser = generateRandomString(12);
                    const userData = new UsersModel({
                        cognitoUserId: data.User.Username,
                        email,
                        fullName,
                        invitationCode,
                        myInvitationCode: invitationCodeUser,
                        deviceToken,
                        registerWith:1,
                        emailDomainVerified: 1, // Mark domain as verified since it's from LinkedIn
                        profilePic:profilePicUrl
                    });
            
                    await userData.save();

                    if(adminInvitationCode === 1)
                    {
                        checkAdminInvitationCode.registerusercount = 1;
                        checkAdminInvitationCode.save();
                    }

                    // Generate JWT access token
                    const accessTokenRes = jwt.sign({ username: data.User.Username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
                    let response = {
                        email,
                        accessToken: accessTokenRes,
                        isCreateProfile:0,
                        linkedinProfileData:profileData
                    };
                    return res.json({ status: 1, message: 'User created successfully via LinkedIn', data: response });
                }

                

              

                
               
            } else {
                // Handle cases where status is not 200 or statusText is not 'OK'
                return res.json({ status: 0, message: "Failed to fetch LinkedIn profile data", error: linkedinProfile.statusText });
               
            }
        } catch (error) {
            return res.json({ status: 0, message: error.message });
        }
    },

    linkedinCallback: async (req, res) => {
        try {
            console.log("Query Params:", req.query);
            let response = {};
    
            // Check if the code parameter exists in the query
            if (req.query.code) {
                // Assuming getAccessToken is asynchronous, await its result
                //const accessToken = await getAccessToken(req.query.code);
    
                // if (!accessToken) {
                //     // Handle the case where accessToken generation fails
                //     return res.status(500).json({
                //         status: 0,
                //         message: "Failed to generate access token.",
                //     });
                // }
    
                //response.accessToken = accessToken;
                response.code = req.query.code;
    
                return res.json({
                    status: 1,
                    message: "Code and Auth token generated successfully",
                    data: response,
                });
            } else {
                // Handle missing code scenario
                return res.status(400).json({
                    status: 0,
                    message: "Missing required 'code' parameter.",
                    data: req.query,
                });
            }
        } catch (error) {
            console.error("Error in LinkedIn callback:", error);
    
            return res.status(500).json({
                status: 0,
                message: "An unexpected error occurred.",
                error: error.message,
            });
        }
    },

   
    // linkedinCallback: async (req, res) => {
    //     console.log("Query Params:", req.query);
    //     let response = {};
    //     if(req.query.code)
    //     {
    //         let accessToken = getAccessToken(req.query.code);
    //         response.accessToken = accessToken;
    //         response.code = req.query.code;
    //         return res.json({ status: 1, message: 'Code and Auth token genrated successfully', data: response });
    //     }
    //     else
    //     {
    //         return res.json({ status: 0, data: req.query});
    //     }
       
    // },

    
    
};
module.exports = authController;