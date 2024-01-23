const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const user = process.env.MONGOODB_USER
const password = encodeURIComponent(process.env.MONGOODB_PASSWORD)

const url = `mongodb+srv://${user}:${password}@cluster0.hhd2lwm.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)