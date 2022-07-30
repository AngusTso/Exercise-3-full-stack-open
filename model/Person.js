const mongoose = require('mongoose')

require('dotenv').config()

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String,
})

module.exports = mongoose.model('Person', PersonSchema)