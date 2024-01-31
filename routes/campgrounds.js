import express from 'express';
import catchAsync from '../helpers/catchAsync.helper.js'
import {index, renderNewForm, createCampground, showCampgrounds, renderEditForm, updateCampground, deleteCampground} from '../controllers/campgrounds.js';
import { isLoggedIn, isAuthorized, validateCamp } from '../middleware.js';
import multer from 'multer';
import storage from '../cloudinary/index.js'
const router = express.Router();

const upload = multer({storage: storage.storage})



router
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCamp,
    catchAsync(createCampground)
  );



router.get('/new', isLoggedIn , renderNewForm );

router
  .route("/:id")
  .get(catchAsync(showCampgrounds))
  .patch(
    isLoggedIn,
    isAuthorized,
    upload.array("image"),
    validateCamp,
    catchAsync(updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthorized,
    catchAsync(deleteCampground)
  );


router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthorized,
  catchAsync(renderEditForm)
);








export default router;
