  const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup_post = async(req,res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if(user) {
      return res.status(200).send({ message: 'User already exists', success: false });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save() //save to mongodb
    res.status(200).send({ message: "User created successfully", success: true });
  }
  catch(err) {
    console.log(err);
    res.status(500).send({message: "Error creating user", success: false, err });
  }
}

module.exports.login_post = async(req,res) => {
  const maxAge = 3*24*60*60;
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({ message: 'Email does not exist', success: false });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (isMatch) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: maxAge
      })
      res.status(200).send({ message: "Login successful", success: true, token})
    } else {
      return res.status(200).send({ message: "Password is incorrect", success: false})
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error logging in", success: false, err})
  }
}

module.exports.getUserById = async (req,res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if(user) {
      res.status(200).send({ success: true, data: {
        fullName: user.fullName,
        email: user.email
      }})
    }
    else {
      return res.status(200).send({ message: "User does not exist", success: false})
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error getting user info", success: false, error})
  }
}