

import cities from './cities.js'
import { places, descriptors } from './seedHelpers.js';
import Campground from '../models/campground.js'
import { db } from '../db.js';

db()


const sample = array => array[Math.floor(Math.random()*array.length)];


export const seedDB = async() => {
    await Campground.deleteMany();
    for (let i=0; i<200; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*100)+10;
        const obj = {
          author: "65ba4adc3775f5e63642c186",
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum placeat suscipit soluta incidunt commodi quidem libero earum nemo architecto amet expedita perspiciatis facilis illo omnis maxime, enim dicta illum accusantium.",
          price,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ],
          },
          images: [
            {
              url: "https://res.cloudinary.com/dmvtcox1f/image/upload/v1704268749/r9huavi9chitmr61tpot.jpg",
              filename: "v1704268749/r9huavi9chitmr61tpot",
            },
          ],
        };
        const data = await Campground.create( obj )
        await data.save()
    }
}

