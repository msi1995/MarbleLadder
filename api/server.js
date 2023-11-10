const authRoutes = require('./routes/authRoutes')
const ladderRoutes = require('./routes/ladderRoutes')
const gemHuntRoutes = require('./routes/gemHuntRoutes')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const uri = process.env.MONGODB_URI || process.env.MONGODB_CIRCLECI_URI || 'mongodb://localhost:27017/marbleLadder';
const port = process.env.PORT ?? 3001;
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`connected to DB at ${uri}`))
    .catch((error) => console.log(error));

app.use('/', authRoutes);
app.use('/', ladderRoutes);
app.use('/', gemHuntRoutes);


//static file serving below seems very touchy. don't mess with it
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});


app.listen(port, () => console.log(`server connected on port ${port}`))