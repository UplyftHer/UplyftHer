const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const DomainManagerModel = require('../../models/admin/DomainManagerModel'); // Updated to DomainManagerModel
const UsersModel = require('../../models/UsersModel');

// AWS S3 configuration (not used in this case, but kept for reference)
const BASE_URL = process.env.BASE_URL;
const bcryptjs = require("bcryptjs");
const key = process.env.KEY;

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.S3_BUCKET_REGION
});

const RECORDS_LIMIT = process.env.RECORDS_LIMIT;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_BUCKET_NAME_POST = process.env.S3_BUCKET_NAME_POST;
const S3_BUCKET_NAME_POST_URL = process.env.S3_BUCKET_NAME_POST_URL;

// DomainManager Controller
const DomainManagerController = {

  // Get all domains
  getAllDomains: async (req, res) => {
    try {
      const domains = await DomainManagerModel.find();


      return res.status(200).json({ domains });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching domains', error: error.message });
    }
  },

  addDomain: async (req, res) => {
    try {
      const { name, status } = req.body;
      //console.log(name, status);
      const domainNameRegex = /^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  
      if (!name || (!domainNameRegex.test(name))) {
        return res.status(400).json({ message: 'Invalid domain name' });
      }

      const sanitizedName = String(name).trim();

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const existingDomain = await DomainManagerModel.findOne({ sanitizedName });
      if (existingDomain) {
        return res.status(409).json({ message: 'Domain name already exists' });
      }

      const newDomain = new DomainManagerModel({
        name:sanitizedName,
        status,
      });

      await newDomain.save();

     // Ensure exact domain match and update user emailDomainVerified status
    //  const domainWithoutAt = name.replace(/^@/, '');
    //  //console.log('hello',domainWithoutAt);
    // if (status === 1) {
    //   await UsersModel.updateMany(
    //     { email: { $regex: `@${domainWithoutAt}$`, $options: 'i' } },
    //     { $set: { emailDomainVerified: 1 } }
    //   );
    // }
    
    // await UsersModel.updateMany(
    //   { email: { $regex: `@${domainWithoutAt}$`, $options: 'i' } },
    //   { $set: { emailDomainVerified: status } }
    // );
    
    const verifiedDomains = await DomainManagerModel.find({ status: 1 }).select('name');
    const verifiedDomainList = verifiedDomains.map(d => d.name.replace(/^@/, '').toLowerCase());

    await UsersModel.updateMany({}, { $set: { emailDomainVerified: 0 } });

    for (const domain of verifiedDomainList) {
      await UsersModel.updateMany(
        { email: { $regex: `@${domain}$`, $options: 'i' } },
        { $set: { emailDomainVerified: 1 } }
      );
    }

      return res.status(201).json({ message: 'Domain added successfully', domain: newDomain });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding domain', error: error.message });
    }
  },





  // Get domain by ID
  getDomainById: async (req, res) => {
    try {
      const { id } = req.params;
       if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.json({ status: 0, errors: { message: 'Invalid id format' } });
       }
      const domain = await DomainManagerModel.findById(id);

      if (!domain) {
        return res.status(200).json({ message: 'Domain not found' });
      }

      res.status(200).json(domain);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching domain data' });
    }
  },

  // Update domain
  updateDomain: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, status } = req.body;

      // Validate input
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.json({ status: 0, errors: { message: 'Invalid id format' } });
      }
      if (typeof name !== 'string' || typeof status !== 'string' || !name.trim() || !status.trim()) {
          return res.status(200).json({ message: 'Name and status are required and must be strings' });
      }

      
      

      const existingDomain = await DomainManagerModel.findById(id);
      if (!existingDomain) {
        return res.status(200).json({ message: 'Domain not found' });
      }
      
      const updatedDomain = await DomainManagerModel.findByIdAndUpdate(
        id,
        { name, status },
        { new: true }
      );
      const domainWithoutAt = name.replace(/^@/, '');

      if (status == 1) {
      await UsersModel.updateMany(
        { email: { $regex: `@${domainWithoutAt}$`, $options: 'i' } },
        { $set: { emailDomainVerified: 1 } }
      );
    } else {
      await UsersModel.updateMany(
        { email: { $regex: `@${domainWithoutAt}$`, $options: 'i' } },
        { $set: { emailDomainVerified: 0 } }
      );
    }
    await UsersModel.updateMany(
      { email: { $regex: `@${domainWithoutAt}$`, $options: 'i' } },
      { $set: { emailDomainVerified: parseInt(status) } }
    );

      return res.status(200).json({ message: 'Domain updated successfully', domain: updatedDomain });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating domain', error: error.message });
    }
  },

  // Delete domain
  deleteDomain: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({ status: 0, errors: { message: 'Invalid id format' } });
      }

      const deletedDomain = await DomainManagerModel.findByIdAndDelete(id);
      if (!deletedDomain) {
        return res.status(200).json({ message: 'Domain not found' });
      }
  
      const verifiedDomains = await DomainManagerModel.find({ status: 1 }).select('name');
      const domainList = verifiedDomains.map(d => d.name.replace(/^@/, '').toLowerCase());
  
      await UsersModel.updateMany({}, { $set: { emailDomainVerified: 0 } });
  
      for (const domain of domainList) {
        await UsersModel.updateMany(
          { email: { $regex: `@${domain}$`, $options: 'i' } },
          { $set: { emailDomainVerified: 1 } }
        );
      }
  
      return res.status(200).json({ message: 'Domain deleted successfully and users updated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting domain', error: error.message });
    }
  },  
};

module.exports = DomainManagerController;
