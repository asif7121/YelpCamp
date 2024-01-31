import { Router } from 'express';
import catchAsync from '../helpers/catchAsync.helper.js'
import {validateReview , isLoggedIn, isReviewAuthor} from '../middleware.js'
import { createReview, deleteReview } from "../controllers/reviews.js";

const router = Router({mergeParams : true});





router.post('/',isLoggedIn, validateReview, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))




export default router;