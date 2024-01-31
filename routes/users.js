import express from 'express';
import passport from 'passport';
import catchAsync from '../helpers/catchAsync.helper.js';
import { storeReturnTo } from '../middleware.js';
import { login, logout, renderLogin, renderSignupForm, signup } from '../controllers/users.js';
const router = express.Router();


router.route('/signup')
.get( renderSignupForm)
.post( catchAsync(signup));

router.route('/login')
.get( renderLogin)
.post( storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect : '/login'}),login);


router.get('/logout', logout); 




export default router;