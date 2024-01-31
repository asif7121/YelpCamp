import Campground from '../models/campground.js'
import cloudinary from '../cloudinary/index.js';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken});

export async function index(req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}


export async function renderNewForm(req, res) {
    res.render('campgrounds/new');
}


export async function createCampground(req, res)  {    
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success',"Successfully made a new Camoground");
    res.redirect(`campgrounds/${campground._id}`);
   
}

export async function showCampgrounds(req, res) {
    const campground = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate :{
            path : 'author'
        }
    }).populate('author');

    if(!campground) {
        req.flash('error', 'Cannot find Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}

export async function renderEditForm(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground})
}

export async function updateCampground(req, res)  {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new : true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
        await  campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    console.log(campground)
    await campground.save();
    req.flash('success','Successfully Updated!');
    return res.redirect(`${campground._id}`);

}

export async function deleteCampground(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted Successfully!')
    res.redirect('/campgrounds');
}