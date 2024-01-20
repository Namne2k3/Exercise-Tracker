const mongoose = require('mongoose')

const logEntry = new mongoose.Schema({
    description: String,
    duration: Number,
    date: Date
})

const LogSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    log: [logEntry]
})

const Log = mongoose.model('Log', LogSchema) || mongoose.models['Log']
module.exports = Log