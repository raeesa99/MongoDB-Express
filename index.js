const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const shortid = require('shortid');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('dotenv').config();

const SessionModel = require('./models/session-model')
const router = require('./routes/routes');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, (err) => {
    console.log(err);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10000 * 60 * 60 * 3},
    store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60 * 3
    }),
    genid: (req) => shortid.generate()
}));
app.use(async(req, res, next) => {
    if (await SessionModel.checkSession(req.sessionID)) {
        res.locals.loggedIn = true
    }
    next();
});

app.use('/', router);
// app.use('/user', userRoutes);

app.engine('.hbs', engine({extname: '.hbs'}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.listen(3030, () => {
    console.log('listening on http://localhost:3030');
});