const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
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