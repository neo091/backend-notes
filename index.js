const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require("./modules/Note")

const app = express()

const morgan_tiny = morgan("tiny")


app.use(morgan_tiny)
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    const html = `
    <h1>Notes Api</h1>
    <a href="./api/notes">ALL</a>
    `
    res.send(html)
})

app.get("/api/notes", (req, response) => {
    Note.find({})
        .then(notes => {
            response.json(notes)
        })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = String(request.params.id)

    Note.findById(id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = String(request.params.id)
    Note.findByIdAndDelete(id).then(result => {
        console.log('Deleted!')
        response.status(204).end()
    }).catch((err) => next(err))

})

app.post('/api/notes', (request, response, next) => {
    const body = request.body
    if (body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save()
        .then(saved => saved.toJSON())
        .then(res => {
            response.json(res)
        })
        .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error("eror: ", error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}  use ctrl+c to close server`)
    console.log(`Api Notes url: http://localhost:${process.env.PORT}/api/notes  use ctrl+c to close server`)
})
