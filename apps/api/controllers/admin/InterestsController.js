const AWS = require('aws-sdk');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const InterestsModel = require('../../models/admin/InterestsModel'); // Import the Interests Model

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
  const InterestsController = {
    
      // Get all interests
      getAllInterests: async (req, res) => {
        try {
            const interests = await InterestsModel.find();
    
            for (let i = 0; i < interests.length; i++) {
                let icon = "";
                
                if (interests[i].icon) {
                    icon = await getSignedUrl(interests[i].icon);  
                }

                interests[i].icon = icon;
            }
    
            if (interests.length === 0) {
                return res.status(200).json({ message: 'No interests found' });
            }
            return res.status(200).json({ interests });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching interests', error: error.message });
        }
    },
    
    addInterests: async (req, res) => {
        try {
            const { name, status } = req.body;
            
            if (!name || !status) {
                return res.status(200).json({ message: 'Name and status are required' });
            }
    
            const existingInterests = await InterestsModel.findOne({ name });
            if (existingInterests) {
                return res.status(200).json({ message: 'Interest name already exists' });
            }
    
            let filePath = ""; 
    
            // Check if a file is uploaded
            if (req.files && req.files.image) {
                const iconFile = req.files.image;
                const currentDate = Date.now();
                const iconFileName = `${currentDate}-${iconFile.name}`;
                filePath = `Uploads/Images/${iconFileName}`;
                await iconFile.mv(filePath);
            }
    
            try {

                const imageUrl = await uploadToS3(filePath);
                fs.unlinkSync(filePath); 
                const newInterest = new InterestsModel({
                    name,
                    status,
                    icon: filePath, 
                });
    
                await newInterest.save();
    
                return res.status(201).json({
                    message: 'Interest added successfully',
                    interest: newInterest,
                });
    
            } catch (uploadError) {
               
                if (filePath) {
                    fs.unlinkSync(filePath);  
                }
                return res.status(500).json({
                    status: 0,
                    errors: { message: 'Error uploading image to S3' },
                });
            }
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error adding interest', error: error.message });
        }
    },
    
    

    getInterestsById : async (req, res) => {
        try {
          const { id } = req.params;
          const interests = await InterestsModel.findById(id);
      
          if (!interests) {
            return res.status(200).json({ message: 'Interests not found' });
          }
          if (interests.icon) {
            interests.icon = await getSignedUrl(interests.icon);
        }
      
          res.status(200).json(interests);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error fetching interests data' });
        }
      },
    

    updateInterests: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
    
            
            if (!name || !status) {
                return res.status(200).json({ message: 'Name and status are required' });
            }
    
            // Find the interest by ID
            const existingInterests = await InterestsModel.findById(id);
            if (!existingInterests) {
                return res.status(200).json({ message: 'Interest not found' });
            }
    
            let iconUrl = existingInterests.icon;  
            // let filePath = ""; 
            let savedata = {
                name,
                status
            }

    
            // Check if a new image is uploaded
            if (req.files && req.files.image) {
                const iconFile = req.files.image;
                const currentDate = Date.now();
                const iconFileName = `${currentDate}-${iconFile.name}`;
                let filePath = `Uploads/Images/${iconFileName}`;
    
                // Move the file to the local directory
                await iconFile.mv(filePath);
    
                try {
                    iconUrl = await uploadToS3(filePath);
                    savedata.icon = filePath;

                    fs.unlinkSync(filePath);
                } catch (uploadError) {

                    if (filePath) {
                        fs.unlinkSync(filePath);
                    }
                    return res.status(500).json({
                        status: 0,
                        errors: { message: 'Error uploading image to S3' },
                    });
                }
            }
    
            
            const updatedInterests = await InterestsModel.findByIdAndUpdate(
                id,
                savedata,
                { new: true }
            );
    
            return res.status(200).json({
                message: 'Interest updated successfully',
                interest: updatedInterests,
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating interest', error: error.message });
        }
    },
    

    // Delete Interests
    deleteInterests: async (req, res) => {
        try {
            const { id } = req.params; 
            const deletedInterests = await InterestsModel.findByIdAndDelete(id);
            if (!deletedInterests) {
                return res.status(200).json({ message: 'Interests not found' });
            }

            return res.status(200).json({ message: 'Interests deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting interests', error: error.message });
        }
    }
};

module.exports = InterestsController;


