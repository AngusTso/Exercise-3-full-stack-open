//Package declaration
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
app.use(express.static('build'))
app.use(cors())
app.use(express.json());
const Person = require(`./..model/Person.js`);
const { default: mongoose } = require('mongoose');

const url = process.env.MONGO_URL

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('content',(request) => {
    return JSON.stringify(request.body)
})
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
//Get request Section
app.get(`/api/persons` , (request, response) => {
    mongoose
        .connect(url)
        .then(Person.find({}).then((person)=>{
            response.json(person);
            mongoose.connection.close();
        }))
})

app.get(`/info` , (request, response) => {
    const now = new Date();
    response.send(`<p>Phonebook has info of ${persons.length} people.</p> <p>${now}</p>`);
})
app.get(`/api/persons/:id` , (request, response) => {
    const id = Number(request.params.id);
    const result = persons.find(person => person.id === id)
    if(result){
        response.json(result);
    }
    else{
        response.status(404).end();
    }
})
//Delete request section
app.delete(`/api/persons/:id` , (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end();
})

//Post request Section
app.post(`/api/persons/`, (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number not exist' 
        })
    }
    else if(persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'Duplicate name , person already exists' 
        })
    }
    const new_person = 
    {
        id: Math.floor(Math.random() * 10000),
        ...body
    }    
   
    persons = persons.concat(new_person)
    response.json(persons)
})

//Open server section
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})