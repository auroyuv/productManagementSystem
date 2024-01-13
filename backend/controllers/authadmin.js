const express = require('express');
const Router = express.Router();
const path = require('path')
const adminModel = require('../schema/adminSchema')


// get admin image and username
Router.get('/getAdminUser/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const admin = await adminModel.findOne({ email: email })

        if (!admin) {
            return res.status(200).send("Email Id was not found in the database")
        }else{
            res.status(200).json({username:admin.username, image:admin.image})
        }
    } catch (error) {
        console.log("Error fetching data", error)
        return res.status(500).send("Error fetching data")
    }
})


module.exports = Router