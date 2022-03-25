
// middleware function used to authenticate users by verifying the user token in the authorization header against the private key

// require('dotenv').config({path: './adminSecret.env'});  // adding the variables in secret.env to environment variables
const jwt = require('jsonwebtoken');

const users = require('../models/users');

exports.protectUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(authHeader.split(" ")[1]);
    // console.log(token);

    if(!token) {  // if authorization header is missing in the request
        return res.status(401).json({status: 'failure', meassage: 'Authorization header is missing in the request'});;
    }  

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);  // synchronous function
        // decoded --> { id: '61655ca99b7b0434274ec356', iat: 1634133587, exp: 1634134187 }

        // console.log(decoded);
        // console.log(decoded.id);

        users.findById(decoded.id)
        .then(user => {
            if(!user)
                return res.status(400).json({status: 'failure', meassage: 'User with the given token does not exist'});
            // console.log(user);
            req.user = user;
            next();
            // console.log('buhahahahhahaaa');

        })
        .catch(err => res.status(400).json({status: 'failure', message: 'Error occured while trying to find user during authentication', error: String(err)}));

    }
    catch(error) {
        res.status(400).json({status: 'failure', message: 'Error occured while trying to to verify token', error: String(error)});
    }
}