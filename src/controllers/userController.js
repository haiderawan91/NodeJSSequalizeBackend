const User = require('../models/User');
const bcrypt = require("bcryptjs");
const path = require('path');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('../config/database');

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
        message: "Email and Password are required",
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

exports.login = async (req,res) => {
  const { email, password } = req.body
  // Check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if(result){
          const maxAge = 20;
          const token = jwt.sign(
            { id: user._id, email:email },
            process.env.jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.status(200).json({
              message: "Login successful",
              user,
              jwt:token,
            })
        }else{
          res.status(400).json({ message: "Login not succesful" })
        }
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}

exports.pdf = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query("SELECT * FROM types");
    // console.log(results);

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'output.pdf');
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(20).text('Types Data', { align: 'center' });
    doc.moveDown();

    // Assuming 'results' is an array of objects
    results.forEach((type) => {
      doc.fontSize(12).text(`ID: ${type.id}, Name: ${type.name}`);
      doc.moveDown();
    });

    doc.end();

    writeStream.on('finish', () => {
      res.download(filePath, 'output.pdf', (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
          res.status(500).send('Error downloading the file');
        }
        fs.unlinkSync(filePath); // Clean up the file after sending it
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};