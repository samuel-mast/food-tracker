const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("MongoDB has landed on ur chin"))
.catch(err => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});