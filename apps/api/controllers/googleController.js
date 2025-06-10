
const { FirebaseData,PushNotification } = require("../utils/firebase.js");
const axios = require('axios');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const UsersModel = require('../models/UsersModel');
const PlacesCacheModel = require("../models/PlacesCacheModel.js");

const googleController = {

 
    
    searchGooglePlaces: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const cognitoUserIdMy = decoded.username;
            //const cognitoUserIdMy = "a3f458d2-10a1-70cc-d6e3-0550a9c75624";
    
            const { query } = req.body;
            if (!query) {
                return res.status(200).json({
                    status: 0,
                    message: "All fields are required",
                });
            }
            if (typeof query !== 'string' || query.trim() === '' || query.length > 200) {
                return res.status(200).json({
                    status: 0,
                    message: "Invalid query parameter",
                });
            }

            
    
            const profile = await UsersModel.findOne({ cognitoUserId: cognitoUserIdMy });
            if (!profile) return res.json({ status: 0, message: "Profile not found" });
    
            // 🔍 **Check MongoDB cache first**
            const cachedResult = await PlacesCacheModel.findOne({ query });
            if (cachedResult) {
                console.log("Serving from MongoDB cache...");
                return res.json({ status: 1, message: "Success (cached)", data: cachedResult.data });
            }
    
            // 🔍 **Call Google Places API**
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
            const params = { query, key: process.env.GOOGLE_API_KEY };
            const response = await axios.get(url, { params });
    
            // 🔍 **Extract country, state, city from API response**
            const getAddressDetails = async (placeId) => {
                const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
                const detailsParams = { place_id: placeId, key: process.env.GOOGLE_API_KEY };
                const detailsResponse = await axios.get(detailsUrl, { params: detailsParams });
    
                let country = "", state = "", city = "";
                const addressComponents = detailsResponse.data.result?.address_components;
                addressComponents?.forEach((component) => {
                    if (component.types.includes("country")) country = component.long_name;
                    if (component.types.includes("administrative_area_level_1")) state = component.long_name;
                    if (component.types.includes("administrative_area_level_3")) city = component.long_name;
                });
    
                return { country, state, city };
            };
    
            // 🔍 **Process results**
            const filteredData = await Promise.all(response.data.results.map(async (place) => {
                const details = await getAddressDetails(place.place_id);
                return {
                    formatted_address: place.formatted_address,
                    location: place.geometry.location,
                    country: details.country,
                    state: details.state,
                    city: details.city,
                };
            }));
    
            // 🔍 **Store response in MongoDB cache**
            await PlacesCacheModel.create({ query, data: filteredData });
    
            return res.json({ status: 1, message: 'Success', data: filteredData });
    
        } catch (error) {
            console.error('Error fetching Places data:', error.message);
            return res.json({ status: 0, message: "Error fetching Places data", error: error.message });
        }
    },
}


module.exports = googleController;