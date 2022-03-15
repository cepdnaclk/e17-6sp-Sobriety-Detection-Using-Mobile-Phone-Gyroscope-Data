const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// importing the mongoose models ///////////////////////////////////////////////////////////////////////////////

const users = require('../models/users');  // importing the mongoose model for the collection 'users'
const admins = require('../models/admins');  // importing the mongoose model for the collection 'users'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// requiring authorization middleware
const { protectAdmin } = require('../middleware/adminAuth');


const router = express.Router();


/**
 * API calls for registration
 * admin emails and detailt will be added by the super-admin
 * when astudent tries to register --> check DB for given email
 * if email exists --> astudent can add a password of his/her choice.
 * astudent setting a password is considered as registering
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
        admins.findOne({email}).select('+password')  // finds the admin by email
        .then(admin => {
            if(admin) {  // given email exists as a admin
                // checks whether the email is set or not. to check whether the admin has already registered or not
                console.log(admin);
                if(admin.isRegistered == false) {  // admin not yet register
                    bcrypt.genSalt(10, (err, salt) => {  //ADD ERROR HANDLING FOR THE genSalt() FUNCTION
                        bcrypt.hash(password0, salt, (err, hash) => {
                            if(err) throw err;  // HANDLE WHAT HAPPENS HERE
                            // setting admin's password to hashed value
                            admin.password = hash;
                            admin.isRegistered = true;
                            // saving the admin with the new password hash
                            admin.save()
                            .then(() => {
                                // success
                                res.json({status: 'success', message: 'Admin is now registered'});
                            })
                            .catch(err => {
                                res.status(400).json({status: 'failure', message: 'Error occured while trying to save the password hash', error: String(err)})  // CHECK THE STATUS CODE
                            }); 
                        })
                    })
                }
                else {  // admin has already registered
                    res.status(400).json({status: 'failure', message: 'Admin has already been registered'})  // CHECK THE STATUS CODE
                }

            }
            else {  // no user with the given email is entered as a admin by the admin
                res.status(400).json({status: 'failure', message: 'The email has not been assigned as a admin by the super-admin'})  // CHECK THE STATUS CODE
            }
        })
        .catch(err => {
            res.status(400).json({status: 'failure', message: 'Error occured while trying to find the admin with the given email', error: String(err)})  // CHECK THE STATUS CODE
        });
    }
});

// API call to login admin
router.post('/login', (req, res) => {
    // frontend does email password field validations
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(400).json({status: 'failure', message: 'Enter both email and password fields'})
    }
    // try{
    admins.findOne({ email }).select("+password")  
    .then(async admin => {
        // console.log(admin);
        if(!admin){
            return res.status(404).json({status: 'failure', message: "Email does not exist"});
        }
        else if(admin.isRegistered == false) {  // to check if the user has not yet registered
            return res.status(400).json({status: 'failure', message: "Admin has not registered"});
        }
        
        try {
            const isMatch = await admin.matchPasswords(password);  // AWAIT WORKS
            // console.log(isMatch);

            if(!isMatch){
                return res.status(405).json({status: 'failure', message: "Invalid credentials"});
            }
            // password match
            // login successful
            // sending token to admin
            const token = await admin.getSignedToken();  // AWAIT WORKS
            // console.log(token);
            // sending the token to the user
            res.json({status: 'success', token});

        }catch(err) {
            res.status(406).json({status: 'failure', message:'Error occured', error: err.message});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({status: 'failure', message: 'Error occured while trying to find the admin by given email', error: err})
    });
    

});


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

/**
 * API calls to the admins collection
 */
// add new admin to the database
router.post('/admins/single', protectAdmin, (req, res) => {
    // method to add a new entry to the user relation in the database
    /**
     * write code to add student to the database
     */
    // not authorizing if the call is not done by a super-admin
    // if(req.admin.role != 'super-admin') {
    //     return res.status(401).json({status: 'failure', message: 'Your admin role is not authorized to add new admins'});
    // }    

    const record = req.body;
    // console.log('Request body: ' + record);
    
    // const response = await admins.create(record);  // response is the return value from mongoDB
    // gives the request body straight away as the object to be created
    const newAdmin = new admins(record);
    // saves the new admin object
    newAdmin.save()
    .then(() => {
        res.json({status: 'success', message: 'Addded new admin to the database', createdEntry: newAdmin});
        // console.log('Created new admin entry: ' + newAdmin);
    })
    .catch(err => res.status(400).json({status: 'failure', message: "Following error occured while trying to create a new admin entry", error: String(err)}));
    
 
    // res.json({status: 'Addded new admin to the database'});  // response after succcesfully creating a new exam schedule


    // redirecting to the login page after a successful registration
    // res.redirect('/*path of the page to redirect to after regitering */'); 
});

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

/**
 * API calls to the users collection
 */
// add new user to the database
router.post('/users/single', protectAdmin, (req, res) => {
    // method to add a new entry to the user relation in the database
    /**
     * write code to add student to the database
     */
    // not authorizing if the call is not done by a super-admin
    // if(req.admin.role != 'super-admin') {
    //     return res.status(401).json({status: 'failure', message: 'Your admin role is not authorized to add new admins'});
    // }    

    const record = req.body;
    // console.log('Request body: ' + record);
    
    // const response = await users.create(record);  // response is the return value from mongoDB
    // gives the request body straight away as the object to be created
    const newUser = new users(record);
    // saves the new admin object
    newUser.save()
    .then(() => {
        res.json({status: 'success', message: 'Addded new user to the database', createdEntry: newAdmin});
        // console.log('Created new user entry: ' + newUser);
    })
    .catch(err => res.status(400).json({status: 'failure', message: "Following error occured while trying to create a new user entry", error: String(err)}));
    
});


module.exports = router;

