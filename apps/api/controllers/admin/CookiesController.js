const AWS = require('aws-sdk');
const fs = require("fs");
const CookiesModel = require('../../models/admin/CookiesModel');

const CookiesController = {
  getCookies: async (req, res) => {
    try {
      const cookies = await CookiesModel.findOne();
      if (!cookies) {
        return res.status(200).json({ message: 'Cookie Policy not found' });
      }
      return res.status(200).json({ cookies });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching cookie policy', error: error.message });
    }
  },

  saveOrUpdateCookies: async (req, res) => {
    try {
      const { content } = req.body;
      let cookies = await CookiesModel.findOne();

      if (cookies) {
        cookies.content = content;
        await cookies.save();
        return res.status(200).json({ message: 'Cookie Policy updated successfully', cookies });
      } else {
        cookies = new CookiesModel({ content });
        await cookies.save();
        return res.status(201).json({ message: 'Cookie Policy added successfully', cookies });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error saving/updating cookie policy', error: error.message });
    }
  },
};

module.exports = CookiesController;
