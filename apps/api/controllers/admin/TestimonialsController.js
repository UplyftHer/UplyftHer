const AWS = require('aws-sdk');
const fs = require("fs");
const TestimonialsModel = require('../../models/admin/TestimonialsModel');

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
                const photoFileOrg = photoFile.name;
                const documentFileName = `${currentDate}-${photoFileOrg}`;
                filePathEvent = `Uploads/Images/${documentFileName}`;
                await photoFile.mv(filePathEvent);

                //console.log("picthere1",filePathEvent);

                try {
                    imageUrl = await uploadToS3(filePathEvent);
                    fs.unlinkSync(filePathEvent);
                } catch (uploadError) {
                    fs.unlinkSync(filePathEvent);
                    return res.json({ status: 0, errors: { message: 'Error uploading profile picture to S3' } });
                }
            }
            console.log("picthere1",filePathEvent);
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

            const testimonial = await TestimonialsModel.findById(id);
            if (!testimonial) {
                return res.status(200).json({ message: 'Testimonial not found' });
            }
            
            let imageUrl = testimonial.image;
            //let filePath = "";
            let savedata = {
                name, 
                age, 
                country, 
                bio, 
                status
            }

            if (req.files && req.files.image) {
                const imageFile = req.files.image;
                 filePath = `Uploads/Images/${Date.now()}-${imageFile.name}`;
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
