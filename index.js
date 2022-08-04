//Package declaration
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
const Person = require('./model/Person')
morgan.token('content',(request) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
//Get request Section
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)
//Get all record
//updated with MongoDB
app.get('/api/persons' , (request, response , next) => {
    Person.find({}).then((person) => {
        response.json(person)
    }).catch(error => next(error))
})

app.get('/info' , (request, response , next) => {
    const now = new Date()
    Person.countDocuments({},(err , c) => {
        response.send(`<p>Phonebook has info of ${c} people.</p> <p>${now}</p>`)
    }).catch(err => next(err))
})

//For Get single record
//updated with MongoDB
app.get('/api/persons/:id' , (request, response , next) => {
    Person.findById(request.params.id).then((person) => {
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    }).catch(error => next(error))
})

//Put request for modifying existing record
app.put('/api/persons/:id', (request, response , next) => {
    Person.findOneAndUpdate({ name: request.body.name }, { number:request.body.number } , { new: true, runValidators: true, context: 'query' }).then(() => {
        response.status(200).end()
    }).catch(error => next(error))
})

//Delete request section
//updated with MONGODB
app.delete('/api/persons/:id' , (request, response , next) => {
    Person.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

//Post request Section

app.post('/api/persons/', (request, response , next) => {
    const body = request.body
    Person.findOne({ name: body.name }).then((person) => {
        if(person){
            return response.status(409).end()
        }
        else{
            const person = new Person(
                {
                    name: body.name,
                    number:body.number,
                })
            person.save().then(() => response.status(200).end()).catch(error => next(error))
        }
    })
    return
})

//Open server section
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})