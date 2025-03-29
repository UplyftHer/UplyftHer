
const AWS = require('aws-sdk');
const fs = require("fs");
const TermsModel = require('../../models/admin/TermsModel');
  
const TermsController = {
  getTerms: async (req, res) => {
    try {
      const terms = await TermsModel.findOne();
      if (!terms) {
        return res.status(200).json({ message: 'Terms & Conditions not found' });
      }
      return res.status(200).json({ terms });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching terms', error: error.message });
    }
  },

  saveOrUpdateTerms: async (req, res) => {
    try {
      const { content } = req.body;
      let terms = await TermsModel.findOne();

      if (terms) {
        terms.content = content;
        await terms.save();
        return res.status(200).json({ message: 'Terms & Conditions updated successfully', terms });
      } else {
        //Create new terms
        terms = new TermsModel({ content });
        await terms.save();
        return res.status(201).json({ message: 'Terms & Conditions added successfully', terms });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error saving/updating terms', error: error.message });
    }
  },
};

module.exports = TermsController;
