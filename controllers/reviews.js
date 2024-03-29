import Campground from '../models/campground.js'
import Review from '../models/review.js'



export async function createReview(req, res)  {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review Posted');
    res.redirect(`/campgrounds/${campground._id}`);
}


export async function deleteReview(req, res)  {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted Successfully!')
    res.redirect(`/campgrounds/${id}`);
}