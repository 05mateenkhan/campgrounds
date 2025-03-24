const mongoose = require('mongoose')
const Campground = require('../Models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        var random1000 = Number(Math.floor(Math.random() * 1000));
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '67cd868facc172bab1e8aa79',


            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude,
                        cities[random1000].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,


            images: [
                {
                    url: 'https://res.cloudinary.com/dohpvwoum/image/upload/v1742637608/images_bh04lu.jpg',
                    filename: 'YelpCamp/camp1'
                },
                {
                    url: 'https://res.cloudinary.com/dohpvwoum/image/upload/v1742637586/KOA-Shelby-Cabin-Photo_fmohp6.jpg',
                    filename: 'YelpCamp/camp2'
                }
            ],


            price: price,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab officiis natus iste, quasi in ratione quia delectus dolore eaque perferendis voluptates, quo ipsam laudantium maiores consectetur! Iusto maiores earum atque. Vero eaque culpa ducimus quasi recusandae. Ratione obcaecati nulla nesciunt earum saepe quisquam quo minus debitis voluptate corrupti facere doloribus ipsum, perspiciatis facilis est ipsa quod? Eligendi possimus excepturi'
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })