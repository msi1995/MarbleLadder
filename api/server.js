const authRoutes = require('./routes/authRoutes')
const ladderRoutes = require('./routes/ladderRoutes')
const express = require('express');
const mongoose = require('mongoose');
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

app.use('/', authRoutes);
app.use('/', ladderRoutes);


app.listen(port, () => console.log(`server connected on port ${port}`))