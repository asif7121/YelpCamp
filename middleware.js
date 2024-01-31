import ExpressError from './helpers/ExpressError.helper.js'
import Campground from './models/campground.js'
import Review from './models/review.js'
import { CampgroundSchema, reviewSchema } from './schemas.js'





export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must login first!!');
       return res.redirect('/login');
    }
    next();
}

export function storeReturnTo(req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// client-side validation
export const validateCamp = (req, res, next) => {
  
    const {error} = CampgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }   
}

export const isAuthorized = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You Are Unauthorized!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


export const isReviewAuthor = async(req, res, next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You Are Unauthorized!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


 export const validateReview = (req, res, next)=> {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }   
}
