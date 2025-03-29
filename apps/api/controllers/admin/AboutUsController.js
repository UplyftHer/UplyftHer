const AWS = require('aws-sdk');
const fs = require("fs");
const AboutUsModel = require('../../models/admin/AboutUsModel')

const AboutUsController = {
  // Get the existing About Us content
  getAboutUsContent: async (req, res) => {  
    try {
      const aboutUsData = await AboutUsModel.findOne(); 
      if (!aboutUsData) {
        return res.status(404).json({ message: 'About Us content not found' });
      }
      return res.status(200).json({ aboutUsData });  
    } catch (error) {
      console.error('Error fetching About Us content:', error);
      return res.status(500).json({ message: 'An error occurred while fetching About Us content', error: error.message });
    }
  },

  // Save or update About Us content
  saveOrUpdateAboutUsContent: async (req, res) => {  
    try {
      const { content } = req.body;
      if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Content cannot be empty' });
      }

      let aboutUsData = await AboutUsModel.findOne();  

      if (aboutUsData) {
        aboutUsData.content = content;
        await aboutUsData.save();
        return res.status(200).json({ message: 'About Us content updated successfully', aboutUsData });  // Renamed `terms` to `aboutUsData`
      } else {
        aboutUsData = new AboutUsModel({ content });
        await aboutUsData.save();
        return res.status(201).json({ message: 'About Us content added successfully', aboutUsData });  // Renamed `terms` to `aboutUsData`
      }
    } catch (error) {
      console.error('Error saving/updating About Us content:', error);
      return res.status(500).json({ message: 'An error occurred while saving/updating About Us content', error: error.message });
    }
  },
};

module.exports = AboutUsController;
