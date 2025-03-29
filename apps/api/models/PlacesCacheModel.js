const mongoose = require("mongoose");

const PlacesCacheSchema = new mongoose.Schema({
    query: { type: String, unique: true, required: true }, // Store search query
    data: { type: Array, required: true }, // Store API response
    createdAt: { type: Date, expires: '10m', default: Date.now } // Auto-delete after 10 minutes
});

const PlacesCache = mongoose.model("PlacesCache", PlacesCacheSchema);
module.exports = PlacesCache;
