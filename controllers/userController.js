const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// User signup
const signUp = async (req, res) => {
  try {
    // Get the required fields from the request object body
    const { fullName, email, password, stack, role } = req.body;

    // Make sure all fields are provided
    if (!fullName || !email || !password || !stack || !role) {
      return res.status(400).json({
        message: 'Please provide all necessary information'
      })
    }

    // Check if the user is already existing in the database
    const checkUser = await userModel.findOne({ emal: email.toLowerCase() })
    if (checkUser) {
      return res.status(409).json({
        message: 'User already registered'
      })
    }

    // Encrypt the user's password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Use the role to determine an admin
    let admin;

    if (role === 'Teacher') {
      admin = true;
    } else {
      admin = false;
    }

    // Create a new user 
    const user = new userModel({
      fullName,
      email,
      stack,
      password: hashedPassword,
      role,
      isAdmin: admin
    });

    // Make sure to save the user data to the database
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      data: user
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


// User login
const logIn = async (req, res) => {
  try {
    // Get the user's login details
    const { email, password } = req.body;

    // Make sure both fields are provided
    if(!email || !password){
      return res.status(400).json({
        message: 'Please provide all necessary information'
      })
    };

    // Find the user in the database 
    const user = await userModel.findOne({email: email.toLowerCase()});

    // Check if the user is not existing and return a response
    if(!user){
      return res.status(404).json({
        message: 'User not found'
      })
    };

    // Verify the user's password
    const checkPassword = bcrypt.compareSync(password, user.password);

    if(!checkPassword){
      return res.status(400).json({
        message: 'Invalid password'
      })
    };

    // Generate a token for the user
    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    }, process.env.SECRET, {expiresIn: '30 min'});

    // Return a success message
    res.status(200).json({
      message: 'User login successfully',
      token
    })
  
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


// Get all user in the database
const getAll = async(req, res) => {
  try {
    // Retrieve all users in the database
    const users = await userModel.find();

    if (users.length === 0){
      return res.status(200).json({
        message: 'There are currently no user in the database'
      })
    };

    // Return a success message
    res.status(200).json({
      message: `These are all the users in the database and they are: ${users.length}`,
      users
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


const scoreUpdate = async (req, res) => {
  try {
    // Get the student's ID to be updated
    const userId = req.params.id;

    // Get the scores from the body
    const {html, node, javaScript, css} = req.body.score;

    // Find the student with the ID
    const student = await userModel.findById(userId);

    // Check if student is not found
    if(!student){
      return res.status(404).json({
        message: `Student with ID: ${userId} not found`
      })
    };

    if(student.isAdmin){
      return res.status(404).json({
        message: `Admin cannot be updated`
      })
    };

    // Update the student's score sheet
    const data = {
      score: {
        html,
        node,
        javaScript,
        css
      }
    }

    // Update the database with the entered scores
    const updatedStudent = await userModel.findByIdAndUpdate(userId, data, {new: true})

    // Return a response
    res.status(200).json({
      message: 'User updated successfully',
      updatedStudent
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const logOut = async(req, res) => {
  try {
    // Get the user's ID from the request user payload
    const { userId } = req.user

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

    const user = await userModel.findById(userId);

    //  check if the user is not exist
    if (!user) {
      return res.status(401).json({
          message: 'User not found'
      })
  }

  // Blacklist the token
    user.blackList.push(token)

    await user.save()

    // Return a response
    res.status(200).json({
      message: 'User logged out successfully'
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


module.exports = {
  signUp,
  logIn,
  getAll,
  scoreUpdate,
  logOut
}
