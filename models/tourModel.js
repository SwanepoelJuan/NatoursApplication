const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        minlength: [10, 'A tour name must have more or equal to 10 characters'],
        // validate: { 
        //     validator: validator.isAlpha, 
        //     message: 'A tour name can only contain alphabet characters'
        // }
    },
    slug: {
        type: String
    }, 
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have a group size']
    },
    difficulty: {
        type: String, 
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'], 
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratings must be above 1.0'],
        max: [5, 'Ratings must below or equal to 5']
    },
    ratingsQuantity: {
        type: Number, 
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number, 
        validate: {
            // This keyword only refers to a new document being created
            validator:  function(val) {
                if(val < this.price) {
                    return true;
                }
                else {
                    return false; 
                }
            }, 
            message: 'Discount price cannot exceed price of the tour'
        }
    }, 
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String, 
        trim: true
    }, 
    imageCover: {
        type: String, 
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date, 
        default: Date.now(),
        select: false     
    },
    startDates: [Date],
    secretTour: {
        type: Boolean, 
        default: false,
    }
}, {
    toJSON: { virutals: true },
    toObject: { virutals: true }
}); //Schema is a like JS class

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration /7; //The reason for the regular function is that we need the this keyword to refer to the current document
});
// // DOCUMENT MIDDLEWARE: Runs before the .save() command and .create() command
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next(); 
});
//Query MIDDLEWARE: 
tourSchema.pre(/^find/, function (next) {
    //This will point to the current query and not the tour 
    this.find({ secretTour: {$ne: true }});
    this.start = Date.now(); 
    next();
})
// //EXECUTED after all other middleware functions
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query execution time: ${Date.now() - this.start} milliseconds`)
    //console.log(docs);

    next(); 
});

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({
        $match: {
            secretTour: { $ne: true}
        }
    });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 