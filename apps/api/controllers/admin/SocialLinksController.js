const AWS = require('aws-sdk');
const fs = require("fs");
const SocialLinksModel = require('../../models/admin/SocialLinksModel'); 

AWS.config.update({
    region: process.env.S3_REGION, // Set your AWS region
    accessKeyId: process.env.S3_ACCESS_KEY, // Your access key
    secretAccessKey: process.env.S3_SECRET_KEY, // Your secret key
});

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function getSignedUrl(key) {
    return new Promise((resolve, reject) => {
        const params = { Bucket: S3_BUCKET_NAME, Key: key, Expires: 1200 };
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) reject(err);
            resolve(url);
        });
    });
}

async function uploadToS3(fileName) {
    const fileContent = fs.readFileSync(fileName);

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline',
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, async (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
}

const SocialLinksController = {
    // Get all social links
    getAllSocialLinks: async (req, res) => {
        try {
            const socialLinks = await SocialLinksModel.find();
            
            for (let i = 0; i < socialLinks.length; i++) {
                if (socialLinks[i].image) {
                    socialLinks[i].image = await getSignedUrl(socialLinks[i].image);
                }
            }

            return res.status(200).json({ socialLinks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching social links', error: error.message });
        }
    },

    // Add a new social link
    addSocialLink: async (req, res) => {
        try {
            const { name, url, accountStatus } = req.body;
             // Check if the social link already exists
        const existingLink = await SocialLinksModel.findOne({ $or: [{ name }, { url }] });
        if (existingLink) {
            return res.status(400).json({ status: 0, message: 'Social link with the same name or URL already exists!' });
        }
            let filePathEvent = '';
            if (req.files && req.files.image) {
                const photoFile = req.files.image;
                const currentDate = Date.now();
                const photoFileOrg = photoFile.name;
                const documentFileName = `${currentDate}-${photoFileOrg}`;
                filePathEvent = `Uploads/Images/${documentFileName}`;
                await photoFile.mv(filePathEvent);

                try {
                    imageUrl = await uploadToS3(filePathEvent);
                    fs.unlinkSync(filePathEvent);
                } catch (uploadError) {
                    fs.unlinkSync(filePathEvent);
                    return res.json({ status: 0, errors: { message: 'Error uploading image to S3' } });
                }
            }

            const newSocialLink = new SocialLinksModel({
                name,
                url,
                accountStatus,
                image: filePathEvent // Store the S3 URL here
            });

            await newSocialLink.save();
            return res.status(201).json({ message: 'Social link added successfully', socialLink: newSocialLink });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error adding social link', error: error.message });
        }
    },

    // Get a social link by its ID
    getSocialLinkById: async (req, res) => {
        try {
            const { id } = req.params;
            const socialLink = await SocialLinksModel.findById(id);

            if (!socialLink) {
                return res.status(200).json({ message: 'Social link not found' });
            }

            if (socialLink.image) {
                socialLink.image = await getSignedUrl(socialLink.image);
            }

            return res.status(200).json({ socialLink });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching social link', error: error.message });
        }
    },

    // Update a social link
    updateSocialLink: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, url, accountStatus } = req.body;

            const socialLink = await SocialLinksModel.findById(id);
            if (!socialLink) {
                return res.status(200).json({ message: 'Social link not found' });
            }

            let imageUrl = socialLink.image;
            //let filePath = "";
            let savedata = {
                name,
                 url,
                accountStatus
            }

            if (req.files && req.files.image) {
                const imageFile = req.files.image;
                let filePath = `Uploads/Images/${Date.now()}-${imageFile.name}`;
                await imageFile.mv(filePath);
                imageUrl = await uploadToS3(filePath);
                savedata.image = filePath;
            }

            const updatedSocialLink = await SocialLinksModel.findByIdAndUpdate(
                id,
                savedata,
                { new: true }
            );

            return res.status(200).json({ message: 'Social link updated successfully', socialLink: updatedSocialLink });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating social link', error: error.message });
        }
    },

    // Delete a social link
    deleteSocialLink: async (req, res) => {
        try {
            const { id } = req.params;
            const socialLink = await SocialLinksModel.findById(id);
            if (!socialLink) {
                return res.status(200).json({ message: 'Social link not found' });
            }

            await SocialLinksModel.findByIdAndDelete(id);

            return res.status(200).json({ message: 'Social link deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting social link', error: error.message });
        }
    }
};

module.exports = SocialLinksController;
