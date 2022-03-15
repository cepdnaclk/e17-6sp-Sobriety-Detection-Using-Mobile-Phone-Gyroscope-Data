const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},  // student names and emails are required
    password: {type: String, default: '', select: false},
    isRegistered: {type: Boolean, default: false}

}, {collection: 'admins'})

adminsSchema.methods.matchPasswords = async function(enteredPassword) {
    // console.log();
    // var isMatch = false;
    // bcrypt.compare(enteredPassword, this.password, function(err, result) {
    //     console.log('inside matchPasswords: ' + result);
    //     cb(result);
    //     // cb(result);  // true if passwords match, else false
    //     // isMatch = result;   
    // });
    // return isMatch;
    const isMatch =  await bcrypt.compare(enteredPassword, this.password);  // AWAIT WORKS
    // console.log(isMatch);
    return isMatch;
}

adminsSchema.methods.getSignedToken = function(cb) {
    // signing a JWT token with the user _id
    // uses the HS256 algorithm to sign
    // uses the use id as the payload
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_ADMIN, {expiresIn: process.env.JWT_EXPIRE_ADMIN});
}

const model = mongoose.model('adminsModel', adminsSchema)

module.exports = model