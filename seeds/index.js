const mongoose = require('mongoose');
const { handle } = require('express/lib/application');
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console,"connection error"));
db.once("open", ()=>{
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)] ;


const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0; i< 200; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 1
        const camp = new Campground({
            author: '61f11ddf43c2a3a76f691a01',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit aut error maxime optio sed! Quam aut debitis, cumque similique sequi deleniti error provident, sit quod maxime qui! Dolorem, sequi provident.',
            price,
            geometry:{
                type:"Point",
                coordinates:[cities[random1000].longitude,cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})


