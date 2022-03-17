const mongoose = require('mongoose');

// Storing time-series data separately for I/O efficiency
const gyroReadingsSchema = new mongoose.Schema({
    readings: [{timestamp: String, x: String, y: String, z: String}],
    // Update readings at each T seconds (T=30s by default. But clients have the option to choose T depending on their resource limitations)
    // However, since the data preprocessor and classifier expect readings of 10s windows, T being 2s, 5s, or any multiple of 10s is recommended
    update_interval: {type: Number, default: 30},
    user_ref: {type: mongoose.Schema.Types.ObjectId, ref: 'usersModel'},
    n_chuks: {type: Number, default: 0},          // Number of T seconds chuks in the readings
}, {collection: 'gyroReadings'});

module.exports = mongoose.model('gyroReadingsModel', gyroReadingsSchema);