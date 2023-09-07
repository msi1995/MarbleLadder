const express = require('express');
const mongoose = require('mongoose');
const auth = require('./auth');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/marbleLadder'
const port = process.env.PORT ?? 3001;
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`connected to DB at ${uri}`))
    .catch((error) => console.log(error));

const ladderPlayer = require('./models/LadderPlayer');


app.post('/register', async (req, res) => {
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
                        message: "Error creating user",
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

app.post("/login", (req, res) => {
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
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    );

                    //   return success response
                    res.status(200).send({
                        message: "Login Successful",
                        uid: user._id,
                        email: user.email,
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


app.get('/ladderdata', async (req, res) => {
    try {
        const ladderData = await ladderPlayer.find({});
        console.log(`the data ${ladderData}`)
        res.status(200).json(ladderData);
    } catch (err) {
        console.error(`error: ${err}`);
        res.status(500).send({ error: "Error fetching ladder data from DB." });
    }
});

app.listen(port, () => console.log(`server connected on port ${port}`))