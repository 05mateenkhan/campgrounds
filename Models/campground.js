const mongoose = require('mongoose');
const Review = require('./review');
const { coordinates } = require('@maptiler/client');
const Schema = mongoose.Schema;

// https://res-console.cloudinary.com/dohpvwoum/thumbnails/v1/image/upload/v1742639993/WWVscENhbXAvY293ZHlkaXo4ZWNucm1ycHJocmw=/drilldown
const ImageSchema = new Schema({
    
        url: String,
        filename: String
     
})
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200/h_200')
})

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 100)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews}})
        console.log(res)
    }
})
                                                          
module.exports = mongoose.model('Campground', CampgroundSchema);
