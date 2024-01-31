
import mongoose from 'mongoose'
import cities from './cities.js'
import { places, descriptors } from './seedHelpers.js';
import Campground from '../models/campground.js'

mongoose.connect('mongodb://localhost:27017/YelpCamp');

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected successfully!")
});


const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async() => {
    await Campground.deleteMany();
    for (let i=0; i<400; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*100)+10;
        const obj = {
            author : '64a562e79ada729011b26ea1',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum placeat suscipit soluta incidunt commodi quidem libero earum nemo architecto amet expedita perspiciatis facilis illo omnis maxime, enim dicta illum accusantium.',
            price ,
            geometry : {
                type : "Point",
                coordinates : [
                    cities[random1000].longitude,
                    cities[random1000].latitude,

                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/diqiqcgjl/image/upload/v1688812672/YelpCamp/u1trzo2kubnehxxmpwkj.jpg',
                  filename: 'YelpCamp/u1trzo2kubnehxxmpwkj'
                }
              ]
        }
        await Campground.create(obj)
    }
}
// export default seedDB
seedDB().then(() => {
    mongoose.connection.close();
})
