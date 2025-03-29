const Admin = require('../../models/admin/adminprofileModel'); // Adjust path as needed
const BookMeetingsModel = require('../../models/BookMeetingsModel');
const UsersModel = require('../../models/UsersModel');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// Initialize AWS Cognito Identity Provider
AWS.config.update({
  region: process.env.S3_REGION, // Set your AWS region
  accessKeyId: process.env.S3_ACCESS_KEY, // Your access key
  secretAccessKey: process.env.S3_SECRET_KEY, // Your secret key
});

const cognito = new AWS.CognitoIdentityServiceProvider();

async function getSignedUrl(keys) {
  return new Promise((resolve, reject) => {
    let params = { Bucket: S3_BUCKET_NAME, Key: keys, Expires: 1200 };
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) reject(err);
      resolve(url);
    });
  });
}



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

const adminProfileController = {
  // Fetch Admin details
  loginAdminDetail: async (req, res) => {
    try {
      const { id } = req.body;


      const admin = await Admin.findById(id);
      if (!admin) {
        return res.json({ status: 0, errors: { message: 'Invalid Admin ID' } });
      }

      let profilePhotoPathUser = admin.profilePic ? await getSignedUrl(admin.profilePic) : "";

      const adminDetails = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profilePic: profilePhotoPathUser,
        status: admin.status
      };

      return res.json({ status: 1, message: 'Admin details fetched successfully', admin: adminDetails });
    } catch (err) {
      return res.json({ status: 0, errors: err.message });
    }
  },

  // Update Admin Profile
  updateProfile: async (req, res) => {
    try {
      const { adminId } = req.body;
      const { name, email, role, status } = req.body;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.json({ status: 0, errors: { message: 'Admin not found' } });
      }

      admin.name = name || admin.name;
      admin.email = email || admin.email;
      admin.status = status || admin.status;

      // console.log('therer',req.files);

      if (req.files && req.files.profilePic) {


        const photoFile = req.files.profilePic;
        const currentDate = Date.now();
        const photoFileOrg = photoFile.name;
        const documentFileName = `${currentDate}${photoFileOrg}`;
        const filePathEvent = `Uploads/Images/${documentFileName}`;

        await photoFile.mv(filePathEvent);

        // Upload to S3
        try {
          //console.log("picthere1",filePathEvent);

          const imageurl = await uploadToS3(filePathEvent);
          //console.log("S3 Image URL:", imageurl);
          fs.unlinkSync(filePathEvent);
          //console.log("picthere",imageurl);

          admin.profilePic = filePathEvent;
        } catch (uploadError) {

          fs.unlinkSync(filePathEvent);  // Still clean up the local file
          return res.json({ status: 0, errors: { message: 'Error uploading profile picture to S3' } });
        }
      }



      // Save the updated admin record
      await admin.save();

      return res.json({
        status: 1,
        message: 'Admin profile updated successfully',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          profilePic: admin.profilePic,  // Send back the updated profilePic
        },
      });
    } catch (err) {
      return res.json({ status: 0, errors: err.message });
    }
  },



  // Reset password
  // resetPassword: async (req, res) => {
  //   try {
  //     const { email } = req.body;
  //     const admin = await Admin.findOne({ email });
  //     if (!admin) {
  //       return res.json({ status: 0, errors: { message: 'Email not found' } });
  //     }

  //     return res.json({ status: 1, message: 'Password reset link sent to email' });
  //   } catch (err) {
  //     return res.json({ status: 0, errors: err.message });
  //   }
  // },

  // Verify OTP and update password
  UpdatePassword: async (req, res) => {
    try {
      const { email, password, newPassword, renewPassword } = req.body;

      if (!email || !password || !newPassword || !renewPassword) {
        return res.status(200).json({ errors: [{ msg: 'Please provide all required fields.' }] });
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(200).json({ errors: [{ msg: 'New password does not meet the required complexity (min 8 chars, 1 number, 1 special character).' }] });
      }

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(200).json({ status: 0, errors: { message: 'Invalid email' } });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(200).json({ errors: [{ msg: 'Current password is incorrect.' }] });
      }

      if (newPassword !== renewPassword) {
        return res.status(200).json({ errors: [{ msg: 'New passwords do not match.' }] });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();

      return res.json({ status: 1, message: 'Password updated successfully' });
    } catch (err) {
      return res.status(500).json({ status: 0, errors: err.message });
    }
  },


  // Admin Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(200).json({ status: 0, errors: { email: 'Email not found! Please enter a valid email' } });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        console.log('there');

        return res.status(200).json({ status: 0, errors: { password: 'Incorrect email or password.' } });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });

      return res.json({
        status: 1,
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          profilePic: admin.profilePic,
          status: admin.status,
        },
      });
    } catch (err) {
      return res.status(500).json({ status: 0, errors: { message: err.message } });
    }
  },
  logout: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(200).json({ status: 0, message: 'Token is missing' });
      }


      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return res.json({ status: 1, message: 'User logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error.message); // Log specific error message
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ status: 1, message: 'Token has already expired' });
      }

      return res.status(500).json({ status: 0, message: error.message });
    }
  },

  // Fetch all getgraphData, with optional filtering
  getgraphData: async (req, res) => {
    try {

      const currentDate = new Date();
      const last12Months = [];
      for (let i = 11; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        last12Months.push({
          month: month.getMonth(),
          year: month.getFullYear(),
          monthName: `${month.toLocaleString('default', { month: 'short' })} ${month.getFullYear().toString().slice(-2)}`  // e.g., "Jan 25"
        });
      }

      const meetings = await BookMeetingsModel.find({
        createdAt: { $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1) }
      }).sort({ createdAt: -1 });

      const users = await UsersModel.find({
        createdAt: { $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1) }
      }).sort({ createdAt: -1 });

      const getMonthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

      // Group meetings by month and year
      const meetingsByMonth = {};
      meetings.forEach(meeting => {
        const monthKey = getMonthKey(new Date(meeting.createdAt));
        meetingsByMonth[monthKey] = (meetingsByMonth[monthKey] || 0) + 1;
      });

      const usersByMonth = {};
      users.forEach(user => {
        const monthKey = getMonthKey(new Date(user.createdAt));
        usersByMonth[monthKey] = (usersByMonth[monthKey] || 0) + 1;
      });

      // Format the result to match the required structure
      const result = last12Months.map(({ monthName, year, month }) => {
        const monthKey = `${year}-${month}`;
        return {
          month: monthName, // Month and year in the format "Jan 25"
          meetings: meetingsByMonth[monthKey] || 0,
          users: usersByMonth[monthKey] || 0,
        };
      });

      return res.json({
        status: 1,
        message: 'getgraphData fetched successfully',
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ status: 0, errors: err.message });
    }
  }


};

module.exports = adminProfileController;
