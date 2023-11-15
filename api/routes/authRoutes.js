const express = require('express');
const auth = require("../auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ladderPlayer = require('../models/LadderPlayer');
const passwordResetRequest = require('../models/PasswordReset');
const { ObjectId } = require('mongodb');
const router = express.Router();
const nodemailer = require('nodemailer');
const tokenKey = process.env.JWT_KEY || "RANDOM-TOKEN"

const emailAddress = process.env.EMAIL
const emailPassword = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: emailAddress,
        pass: emailPassword
    },
});

router.post('/register', async (req, res) => {
    const emailExists = await ladderPlayer.findOne({ email: req.body.email })
    if (Boolean(emailExists)) {
        res.status(500).send({
            message: "Account with that email already exists",
        });
        return;
    }
    const usernameTaken = await ladderPlayer.findOne({ username: req.body.username })
    if (Boolean(usernameTaken)) {
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

router.post("/login", async (req, res) => {
    // check if email exists
    ladderPlayer.findOne({ email: req.body.email })
        .then((user) => {
            // if(!Boolean(user.isVerified)){
            //     return res.status(400).send({
            //         message: "Email verification incomplete."
            //     })
            // }
            // compare the password entered and the hashed password found
            bcrypt
                .compare(req.body.password, user.password)
                // if the passwords match
                .then((passwordCheck) => {
                    // check if password matches
                    if (!passwordCheck) {
                        return res.status(400).send({
                            message: "Incorrect email or password.",
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
                        tokenKey,
                        { expiresIn: "28d" }
                    );

                    //   return success response
                    res.status(200).send({
                        message: "Login Successful",
                        username: user.username,
                        token,
                    });
                })
                .catch((error) => {
                    res.status(400).send({
                        message: "Incorrect email or password.",
                        error,
                    });
                });
        })
        .catch((e) => {
            res.status(400).send({
                message: "Incorrect email or password",
                e,
            });
        });
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const token = jwt.sign(
        {
            email: email
        },
        "RECOVERY-TOKEN",
    );
    const expiryTime = new Date(Date.now() + 600000); // 10min

    //delete any existing tokens tied to the email address
    await passwordResetRequest.deleteMany({ email: email })
    const newPasswordResetRequest = new passwordResetRequest({
        email: email,
        token: token,
        expiry: expiryTime,
    })
    newPasswordResetRequest.save();

    const mailOptions = {
        from: {
            name: 'MarbleLadder',
            address: emailAddress
        },
        to: email,
        subject: 'Password Reset Request',
        html: `
          <p>Click the following link to reset your password. This link will expire in 10 minutes.</p>
          <a href="https://marbleladder.com/reset-password?email=${email}&token=${token}">Reset Password</a>
        `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

router.get('/check-admin', auth, async (req, res) => {
    const {admin} = await ladderPlayer.findOne({ _id: new ObjectId(req.user.userId) })
    if(admin){
        res.status(200).send({admin: true})
    }
    else{
        res.status(200).send({admin: false})
    }
    try {
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/check-reset-token', async (req, res) => {
    const { email, token } = req.body;
    try {
        const currentDate = new Date();
        const validToken = await passwordResetRequest.findOne({ email: email, token: token, expiry: { $gt: currentDate } })

        if (Boolean(validToken)) {
            res.status(200).send({
                message: "Valid.",
            });
            return;
        }
        else {
            res.status(403).send({
                message: "Token invalid/expired."
            })
        }
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/reset-password', async (req, res) => {
    const { email, token, password } = req.body;
    try {
        const currentDate = new Date();
        const validToken = await passwordResetRequest.findOne({ email: email, token: token, expiry: { $gt: currentDate } })

        //checking it again in case client directly accesses reset-password
        if (Boolean(validToken)) {
            const hashedPass = await bcrypt.hash(password, 10)
            await ladderPlayer.updateOne({ email: email },
                {
                    $set: {
                        password: hashedPass
                    }
                }
            )
            //double check delete any existing tokens tied to the email address after reset complete
            await passwordResetRequest.deleteMany({ email: email })
            res.status(201).send({
                message: 'Password reset.'
            })
            return
        }
        else {
            res.status(403).send({
                message: "Forbidden or error."
            })
        }
    }
    catch (e) {
        console.log(e);
    }
});

module.exports = router;