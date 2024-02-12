const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true,
        maxLength: [250,"Description must be less than 250 characters"]
    },
    price: {
        type: Number,
        required: true 
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
    ],
    stockQuantity: {
        type: Number,
        required: true ,
        min: 0
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true 
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    totalQuantitySold: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    offer: {
        isOffered: {
            type: Boolean,
            default: false,
        },
        offerStartDate: {
            type: Date,
            default: null,
            validate: {
                validator: function (value) {
                    return !this.isOffered || !this.offerEndDate || value < this.offerEndDate;
                },
                message: 'Offer start date must be before the end date.',
            },
        },
        offerEndDate: {
            type: Date,
            default: null,
            offerEndDate: {
                type: Date,
                default: null,
                validate: {
                    validator: function (value) {
                        return !this.isOffered || !this.offerStartDate || value > new Date();
                    },
                    message: 'Offer end date must be in the future.',
                },
            }
        }
    }    
})

productSchema.pre('save', async function (next) {
    try {
        const reviews = await mongoose.model('Review').find({ _id: { $in: this.reviews } });

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            this.averageRating = totalRating / reviews.length;
        } else {
            this.averageRating = 0;
        }

        next();
    } catch (error) {
        next(error);
    }
});


const Product = mongoose.model('Product',productSchema)

module.exports = Product