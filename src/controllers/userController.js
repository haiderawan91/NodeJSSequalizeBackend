const User = require('../models/User');
const bcrypt = require("bcryptjs")

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email , password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email or Password not present",
      })
    }

    bcrypt.hash(password, 10).then(async (password) => {
    console.log(password)
      await User.create({ email , password }).then((user) =>
        res.status(200).json({
          message: "User successfully created",
           user,
        })
      )
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );

    })
     
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const {email} = req.query;
    console.log(req.query)
    const user = await User.findOne({ where: {
      email: email,
    } });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
