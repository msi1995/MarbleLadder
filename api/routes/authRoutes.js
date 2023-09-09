const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ladderPlayer = require('../models/LadderPlayer');
const router = express.Router();

router.post('/register', async (req, res) => {
    const emailExists = await ladderPlayer.findOne({email: req.body.email})
    if(Boolean(emailExists)){
        res.status(500).send({
            message: "Account with that email already exists",
        });
        return;
    }
    const usernameTaken = await ladderPlayer.findOne({username: req.body.username})
    if(Boolean(usernameTaken)){
        res.status(500).send({
            message: "That username is taken",
        });
        return;
    }

    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            const newLadderPlayer = new ladderPlayer({
                email: req.body.email,
                password: hashedPassword,
                username: req.body.username,
                createdAt: new Date(),
            })
            newLadderPlayer.save()
                .then((result) => {
                    res.status(201).send({
                        message: "User Created Successfully",
                        result,
                    });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    res.status(500).send({
                        message: "Try again later",
                        error,
                    });
                });
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
            res.status(500).send({
                message: "Password was not hashed successfully",
                e,
            });
        });
});

router.post("/login", (req, res) => {
    // check if email exists
    ladderPlayer.findOne({ email: req.body.email })
        .then((user) => {
            // compare the password entered and the hashed password found
            bcrypt
                .compare(req.body.password, user.password)
                // if the passwords match
                .then((passwordCheck) => {
                    // check if password matches
                    if (!passwordCheck) {
                        return res.status(400).send({
                            message: "Passwords does not match",
                            error,
                        });
                    }
                    // create JWT token
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email,
                            username: user.username,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    );

                    //   return success response
                    res.status(200).send({
                        message: "Login Successful",
                        username: user.username,
                        token,
                    });
                })
                // catch error if password does not match
                .catch((error) => {
                    res.status(400).send({
                        message: "Passwords does not match",
                        error,
                    });
                });
        })
        // catch error if email does not exist
        .catch((e) => {
            res.status(404).send({
                message: "Email not found",
                e,
            });
        });
});

module.exports = router;