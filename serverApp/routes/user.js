const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// importing the mongoose models ///////////////////////////////////////////////////////////////////////////////

const users = require('../models/users');  // importing the mongoose model for the collection 'devices'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// requiring authorization middleware
const { protectUser } = require('../middleware/userAuth');

const router = express.Router();


/**
 * API calls for registration
 * user emails and detailt will be added by the admin
 * when user tries to register --> check DB for given email
 * if email exists --> user can add a password of his/her choice.
 * user setting a password is considered as registering
 */

// API call to register proctor
router.post('/register', (req, res) => {
    const {email, password0, password1} = req.body;

    // let errors = [];

    // checking of required fields is done by the frontend

    // checking this just incase because suri is dumb
    if(password0 != password1) {
        // errors.push({msg: 'Passwords do not match'});
        res.status(400).json({status: 'failure', message: 'Entered passwords do not match'})  // CHECK THE STATUS CODE
    }
    else {
        // validation passed
        users.findOne({email}).select('+password')  // finds the user by email
        .then(user => {
            if(user) {  // given email exists as a user
                // checks whether the email is set or not. to check whether the user has already registered or not
                console.log(user);
                if(user.isRegistered == false) {  // user not yet register
                    bcrypt.genSalt(10, (err, salt) => {  //ADD ERROR HANDLING FOR THE genSalt() FUNCTION
                        bcrypt.hash(password0, salt, (err, hash) => {
                            if(err) throw err;  // HANDLE WHAT HAPPENS HERE
                            // setting user's password to hashed value
                            user.password = hash;
                            user.isRegistered = true;
                            // saving the user with the new password hash
                            user.save()
                            .then(() => {
                                // success
                                res.json({status: 'success', message: 'User is now registered'});
                            })
                            .catch(err => {
                                res.status(400).json({status: 'failure', message: 'Error occured while trying to save the password hash', error: String(err)})  // CHECK THE STATUS CODE
                            }); 
                        })
                    })
                }
                else {  // user has already registered
                    res.status(400).json({status: 'failure', message: 'User has already been registered'})  // CHECK THE STATUS CODE
                }

            }
            else {  // no user with the given email is entered as a user by the user
                res.status(400).json({status: 'failure', message: 'The email has not been assigned as a user by the admin'})  // CHECK THE STATUS CODE
            }
        })
        .catch(err => {
            res.status(400).json({status: 'failure', message: 'Error occured while trying to find the user with the given email', error: String(err)})  // CHECK THE STATUS CODE
        });
    }
});




// API call to login user
router.post('/login', (req, res) => {
    // frontend does email password field validations
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(400).json({status: 'failure', message: 'Enter both email and password fields'})
    }
    // try{
    users.findOne({ email }).select("+password")  
    .then(async user => {
        // console.log(user);
        if(!user){
            return res.status(404).json({status: 'failure', message: "Email does not exist"});
        }
        else if(user.isRegistered == false) {  // to check if the user has not yet registered
            return res.status(400).json({status: 'failure', message: "User has not registered"});
        }
        
        try {
            const isMatch = await user.matchPasswords(password);  // AWAIT WORKS
            // console.log(isMatch);

            if(!isMatch){
                return res.status(405).json({status: 'failure', message: "Invalid credentials"});
            }
            // password match
            // login successful
            // sending token to user
            const token = await user.getSignedToken();  // AWAIT WORKS
            // console.log(token);
            // sending the token to the user
            res.json({status: 'success', token});

        }catch(err) {
            res.status(406).json({status: 'failure', message:'Error occured', error: err.message});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({status: 'failure', message: 'Error occured while trying to find the user by given email', error: err})
    });
    
});

module.exports = router;
