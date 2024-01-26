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
    res.send('<h1>Notes Api</h1>')
})

app.get("/api/notes", (req, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    const id = String(request.params.id)
    response.json({ id: id })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body
    if (body.content === undefined) {
        return response.status(404).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save().then(saved => {
        console.log('note saved!')
        response.json(saved)
    })
        .catch(error => {
            console.log('error', error)
        })


})


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}  use ctrl+c to close server`)
    console.log(`Api url: http://localhost:${process.env.PORT}  use ctrl+c to close server`)
})
