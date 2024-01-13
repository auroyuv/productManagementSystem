const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path')
const adminModel = require('../schema/adminSchema')


// Registering admin
Router.post('/register', async (req, res) => {
    const username = req.body.userName;
    const email = req.body.registerEmail;
    const mobileNo = req.body.mobileNo;
    const password = req.body.registerPassword;

    if (!email || !password || !username || !mobileNo) {
        return res.status(400).send("All fields are required");
    }

    try {
        const adminEmail = await adminModel.findOne({ email: email });

        if (adminEmail) {
            return res.status(200).send("User already exists");
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newAdmin = new adminModel({
            username: username,
            email: email,
            mobileNo: mobileNo,
            password: hashedPassword,
        });

        const registerAdmin = await newAdmin.save();

        if (registerAdmin) {
            return res.status(200).json({ message: "Registered Successfully", id: registerAdmin._id });
        } else {
            return res.status(404).send("Internal server error");
        }
    } catch (error) {
        console.log("Error fetching data", error);
        return res.status(500).send("Internal server error");
    }
});


// Storage for Profile Image files 
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './uploads/profile')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage })


// Upload image to uploads folder
Router.post('/uploadProfileImage/:id', async (req, res, next) => {
    const id = req.params.id;

    const admin = await adminModel.findOne({_id:id});

    if (admin) {
        upload.single('profileImage')(req, res, async (err) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(400).json({ error: 'File upload error', details: err.message });
            }

            if (!req.file) {
                return res.status(200).send("No file");
            }

            const image = req.file.filename;
            try {
                const admin = await adminModel.findByIdAndUpdate(id, { image: image });
                console.log("-------Registered-user------", admin, "Added Image", image)
                res.status(200).send("File uploaded successfully");
            } catch (error) {
                console.error('Database update error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }else{
        res.status(200).json({message:"user not found"})
    }
});


// Admin Login
Router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const admin = await adminModel.findOne({ email: email });

    if (!admin) {
      return res.status(200).send("Email Id was not found in the database");
    }

    const verifyPassword = bcrypt.compareSync(password, admin.password);

    if (!verifyPassword) {
      return res.status(200).send("Please enter correct password");
    } else {
      const tokenPayload = {
        adminId: admin._id,
        email: email,
      };

      const token = jwt.sign(tokenPayload, 'access', { expiresIn: '1h' });

      return res.status(200).send({
        token: token,
        message: "Logged in successfully",
        emailId: email,
        adminId: admin._id,
      });
    }
  } catch (error) {
    console.log("Error fetching data", error);
    return res.status(500).send("Error fetching data");
  }
});


module.exports = Router