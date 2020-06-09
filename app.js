require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const MONGODB_URI = 'mongodb+srv://notesAdmin:kdPUTtfkY4VWqRlv@cluster0-jzxcu.mongodb.net/jobPortal?retryWrites=true&w=majority';

//Imported files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');

const app = express();
const port = process.env.PORT || 3030;

//DB connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('DB connected');
});

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', profileRoutes);



//Starting a server
app.listen(port, () => {
    console.log('connected and running');
})