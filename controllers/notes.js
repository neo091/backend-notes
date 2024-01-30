const notesRouter = require('express').Router()
const Note = require('../modules/Note')

notesRouter.get("/", async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get("/:id", async (request, response) => {
    const note = await Note.findById(request.params.id)
    response.json(note)
})

notesRouter.put("/:id", async (request, response) => {

    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    await Note.findByIdAndUpdate(request.params.id, note, { new: true })

    response.status(200).end()
})

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(200).end()
})

notesRouter.post('/', async (request, response) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save()

    response.json(note)

})


module.exports = notesRouter