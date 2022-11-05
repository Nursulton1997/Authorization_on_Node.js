require("dotenv").config();
require("./config/database").connect();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const express = require("express");

const app = express();

app.use(express.json());
const auth = require("./middleware/auth");

const User = require("./model/user");

app.post("/register", async (req, res) => {
// Our register logic starts here
    try {
        // Get user input
        const {first_name, last_name, email, password} = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            return res.status(400).send({
                status: false,
                message: "All input is required",
            });
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        // save user token
        user.token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const {email, password} = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            // save user token
            user.token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // user
            res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

app.post("/welcome", auth, (req, res) => {
    return res.status(200).send({
        user_id: req.user.user_id,
        email: req.user.email,
    });
});

module.exports = app;