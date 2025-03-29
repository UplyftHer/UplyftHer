const AWS = require('aws-sdk');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const IndustryModel = require('../../models/admin/IndustryModel'); // Import the Industry Model

AWS.config.update({
    region: process.env.S3_REGION, // Set your AWS region
    accessKeyId: process.env.S3_ACCESS_KEY, // Your access key
    secretAccessKey: process.env.S3_SECRET_KEY, // Your secret key
});

const IndustryController = {
   
    // Get all industries
    getAllIndustries: async (req, res) => {
        try {
            const industries = await IndustryModel.find();
            if (industries.length === 0) {
                return res.status(200).json({ message: 'No industries found' });
            }
            return res.status(200).json({ industries });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching industries', error: error.message });
        }
    },

    // Add Industry
    addIndustry: async (req, res) => {
        try {
            const { name, status } = req.body;
    
            if (!name || !status) {
                return res.status(200).json({ message: 'Name and status are required' });
            }
    
            // Check if the industry name already exists
            const existingIndustry = await IndustryModel.findOne({ name });
            if (existingIndustry) {
                return res.status(409).json({ message: 'Industry name already exists' });
            }
    
            const newIndustry = new IndustryModel({
                name,
                status,
            });
    
            // Save the new industry
            await newIndustry.save();
            return res.status(201).json({ message: 'Industry added successfully', industry: newIndustry });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error adding industry', error: error.message });
        }
    },
    getIndustryById : async (req, res) => {
        try {
          const { id } = req.params;
          const industry = await IndustryModel.findById(id);
      
          if (!industry) {
            return res.status(200).json({ message: 'Industry not found' });
          }
      
          res.status(200).json(industry);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error fetching industry data' });
        }
      },
    

    // Update Industry
    updateIndustry: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, status } = req.body;

            // Validate required fields
            if (!name || !status) {
                return res.status(200).json({ message: 'Name and status are required' });
            }


            const updatedIndustry = await IndustryModel.findByIdAndUpdate(id, { name, status }, { new: true });

            if (!updatedIndustry) {
                return res.status(200).json({ message: 'Industry not found' });
            }

            return res.status(200).json({ message: 'Industry updated successfully', industry: updatedIndustry });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating industry', error: error.message });
        }
    },

    // Delete Industry
    deleteIndustry: async (req, res) => {
        try {
            const { id } = req.params; 
            const deletedIndustry = await IndustryModel.findByIdAndDelete(id);
            if (!deletedIndustry) {
                return res.status(200).json({ message: 'Industry not found' });
            }

            return res.status(200).json({ message: 'Industry deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting industry', error: error.message });
        }
    }
};

module.exports = IndustryController;


