var mongoose = require('mongoose')

module.exports = mongoose.model('Post', {
    description : String,
    author : { type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    dosage : Number,
    notes : String
})
