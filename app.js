if(process.env.NODE_ENV!=="production"){
    dotenv.config()
}
    
import dotenv from 'dotenv'
import express from 'express';
import path, {dirname} from 'path';
import mongoose from 'mongoose';
import engine from 'ejs-mate';
import session, { Cookie } from 'express-session';
import flash from 'connect-flash';
import ExpressError from './helpers/ExpressError.helper.js';
import { fileURLToPath } from 'url';
import   methodOverride from 'method-override';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js'
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import MongoStore from 'connect-mongo';

import userRoutes from './routes/users.js'
import campgroundRoutes from './routes/campgrounds.js'
import reviewRoutes from './routes/reviews.js'
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const Port = +process.env.PORT


db()


const app = express();


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(ExpressMongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));


import {store} from "./db.js"


const sessionConfig = {
    store,
    name: 'anonymous',
    secret : 'it is a secret',
    // secure: true,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly: true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    },
    
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res)=> {
    res.render('home')
});



app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong"
    res.status(statusCode).render('error', {err});
    next();
})

app.listen(Port, ()=> {
    console.log(`App is running on port ${Port}`)
});