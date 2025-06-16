const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const fs = require("fs");
const TestimonialsModel = require('../../models/admin/TestimonialsModel');
const path = require('path');

// Initialize AWS Cognito Identity Provider
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
    return `${process.env.BASE_URL_IMAGE}/${key}`;
    // return new Promise((resolve, reject) => {
    //     const params = { Bucket: S3_BUCKET_NAME, Key: key, Expires: 1200 };
    //     s3.getSignedUrl('getObject', params, (err, url) => {
    //         if (err) reject(err);
    //         resolve(url);
    //     });
    // });
}



async function uploadToS3(fileName) {
    const filePath = path.join(__dirname, 'Uploads', 'Images', fileName);
    // Read the file
    const fileContent = fs.readFileSync(filePath);
    

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

const TestimonialsController = {
    getAllTestimonials: async (req, res) => {
        try {
            const testimonials = await TestimonialsModel.find();
            
            for (let i = 0; i < testimonials.length; i++) {
                if (testimonials[i].image) {
                    //testimonials[i].image = await getSignedUrl(testimonials[i].image);
                    testimonials[i].image = `${process.env.BASE_URL_IMAGE}/${testimonials[i].image}`;
                }
            }

            return res.status(200).json({ testimonials });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
        }
    },

    addTestimonial: async (req, res) => {
        try {
            const { name, age, country, bio, status } = req.body;
            let filePathEvent = '';
            if (req.files && req.files.image) {
               
                const photoFile = req.files.image;
                const currentDate = Date.now();

                // Extract original extension
                const originalExt = path.extname(photoFile.name);

                // Generate safe random filename (no user-controlled input in path!)
                const randomName = crypto.randomBytes(16).toString('hex');
                const documentFileName = `${currentDate}-${randomName}${originalExt}`;

                
                // Safe local path
                filePathEvent = path.join('Uploads/Images', documentFileName);

                // Ensure directory exists
                fs.mkdirSync(path.dirname(filePathEvent), { recursive: true });
                await photoFile.mv(filePathEvent);

              

                try {
                    imageUrl = await uploadToS3(filePathEvent);
                    // Delete local file (you said you still want to delete it)
                    if (fs.existsSync(filePathEvent)) {
                        fs.unlinkSync(filePathEvent);
                    }
                } catch (uploadError) {
                    // Delete local file (you said you still want to delete it)
                    if (fs.existsSync(filePathEvent)) {
                        fs.unlinkSync(filePathEvent);
                    }
                    return res.json({ status: 0, errors: { message: 'Error uploading profile picture to S3' } });
                }
            }
           
            const newTestimonial = new TestimonialsModel({
                name,
                age,
                country,
                bio,
                status,
                image: filePathEvent // Store the S3 URL here
            });

            await newTestimonial.save();
            return res.status(201).json({ message: 'Testimonial added successfully', testimonial: newTestimonial });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error adding testimonial', error: error.message });
        }
    },
    getTestimonialById: async (req, res) => {
        try {
            const { id } = req.params;
            const testimonial = await TestimonialsModel.findById(id);

            if (!testimonial) {
                return res.status(200).json({ message: 'Testimonial not found' });
            }

            // If testimonial has an image, fetch a signed URL for it
            if (testimonial.image) {
                testimonial.image = await getSignedUrl(testimonial.image);
            }

            return res.status(200).json({ testimonial });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching testimonial', error: error.message });
        }
    },

    updateTestimonial: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, age, country, bio, status } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(200).json({ message: 'Invalid testimonial ID' });
            }

            const testimonial = await TestimonialsModel.findById(id);
            if (!testimonial) {
                return res.status(200).json({ message: 'Testimonial not found' });
            }
            
            let imageUrl = testimonial.image;
            const nameSafe = typeof name === 'string' ? name.trim() : testimonial.name;

            let ageSafe = testimonial.age;
            if (typeof age !== 'undefined') {
                if (!Number.isInteger(Number(age)) || Number(age) <= 0) {
                    return res.status(200).json({ message: 'Invalid age' });
                }
                ageSafe = Number(age);
            }
            const countrySafe = typeof country === 'string' ? country.trim() : testimonial.country;
            const bioSafe = typeof bio === 'string' ? bio.trim() : testimonial.bio;
            let statusSafe = testimonial.status;
            if (typeof status !== 'undefined') {
                if (status === '0' || status === 0) {
                    statusSafe = 0;
                } else if (status === '1' || status === 1) {
                    statusSafe = 1;
                } else {
                    return res.status(200).json({ message: 'Invalid status' });
                }
            }
            //let filePath = "";
            let savedata = {
                name:nameSafe, 
                age:ageSafe, 
                country:countrySafe, 
                bio:bioSafe, 
                status:statusSafe,
                image:""
            }

            if (req.files && req.files.image) {
                const imageFile = req.files.image;
                const ext = path.extname(imageFile.name).toLowerCase();
                const safeFileName = crypto.randomBytes(16).toString('hex') + ext;
                filePath = path.join('Uploads', 'Images', `${Date.now()}-${safeFileName}`);
                await imageFile.mv(filePath);
                imageUrl = await uploadToS3(filePath);
                savedata.image = filePath;
            }

            const updatedTestimonial = await TestimonialsModel.findByIdAndUpdate(
                id,
                savedata,
                { new: true }
            );

            return res.status(200).json({ message: 'Testimonial updated successfully', testimonial: updatedTestimonial });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating testimonial' });
        }
    },

    deleteTestimonial: async (req, res) => {
        try {
            const { id } = req.params;
            const testimonial = await TestimonialsModel.findById(id);
            if (!testimonial) {
                return res.status(200).json({ message: 'Testimonial not found' });
            }

            await TestimonialsModel.findByIdAndDelete(id);

            return res.status(200).json({ message: 'Testimonial deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting testimonial' });
        }
    }
};

module.exports = TestimonialsController;
