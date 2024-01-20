const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: new Date().toDateString()
    }
})

const Exercise = mongoose.model('Exercise', ExerciseSchema) || mongoose.models['Exercise']

module.exports = Exercise