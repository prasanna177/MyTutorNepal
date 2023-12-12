const User = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports.signup_post = async(req,res) => {
  try {
    let { email, password } = req.body
    const userExists = await User.findOne({ email });
    if(userExists) {
      return res.status(200).send({ message: 'User already exists', success: false })
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body)
    console.log(newUser);
    await newUser.save() //save to mongodb
    res.status(200).send({ message: "User created successfully", success: true });
  }
  catch(err) {
    res.status(500).send({message: "Error creating user", success: false, err });
  }
}

module.exports.login_post = async(req,res) => {
  try {

  }
  catch (err) {

  }
}