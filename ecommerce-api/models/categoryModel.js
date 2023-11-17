const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true 
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null 
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
})

const Category = mongoose.model('Category',categorySchema)

module.exports = Category;