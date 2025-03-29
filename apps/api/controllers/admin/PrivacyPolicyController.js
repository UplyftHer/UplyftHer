const AWS = require('aws-sdk');
const fs = require("fs");
const PrivacyPolicyModel = require('../../models/admin/PrivacyModel'); // Changed the model name to PrivacyPolicyModel
  
const PrivacyPolicyController = {
  getTerms: async (req, res) => {
    try {
      const privacyPolicy = await PrivacyPolicyModel.findOne();
      if (!privacyPolicy) {
        return res.status(200).json({ message: 'Privacy Policy not found' });
      }
      return res.status(200).json({ privacyPolicy });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching privacy policy', error: error.message });
    }
  },

  saveOrUpdateTerms: async (req, res) => {
    try {
      const { content } = req.body;
      let privacyPolicy = await PrivacyPolicyModel.findOne();

      if (privacyPolicy) {
        privacyPolicy.content = content;
        await privacyPolicy.save();
        return res.status(200).json({ message: 'Privacy Policy updated successfully', privacyPolicy });
      } else {
        // Create new privacy policy
        privacyPolicy = new PrivacyPolicyModel({ content });
        await privacyPolicy.save();
        return res.status(201).json({ message: 'Privacy Policy added successfully', privacyPolicy });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error saving/updating privacy policy', error: error.message });
    }
  },
};

module.exports = PrivacyPolicyController;

