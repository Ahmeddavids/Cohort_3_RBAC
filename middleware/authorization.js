const userModel = require("../models/userModel.js")
const jwt = require("jsonwebtoken")


const authenticate = async (req, res, next) => {
    try {
        // get your token from the authorization
        const hasAuthorization = req.headers.authorization;

        //  check if it is empty
        if (!hasAuthorization) {
            return res.status(401).json({
                message: 'Authorization token not found'
            })
        }

        //  split the token fron the bearer
        const token = hasAuthorization.split(" ")[1];

        // check if it get back a token
        if (!token) {
            return res.status(401).json({
                message: 'authorization no found'
            })
        };


        // confirm the validity of the token
        const decodeToken = jwt.verify(token, process.env.secret);

        // get the usr thrugh the token
        const user = await userModel.findById(decodeToken.userId);

        // check if the user is still existing in the database

        if (!user) {
            return res.status(404).json({
                message: "Authorization Failed: User not found"
            })
        }

        if (user.blackList.includes(token)) {
            return res.status(401).json({
                message: "Authorization Failed: Please login to continue"
            })
        }

        req.user = decodeToken;

        next();

    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(501).json({
                message: 'session timedout, Please login to continue'
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
};


// Authorize an admin
const admin = (req, res, next) => {
    authenticate(req, res, async () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(401).json({
                message: 'User not authorized'
            })
        }
    })
}

module.exports = {
    authenticate,
    admin
}
