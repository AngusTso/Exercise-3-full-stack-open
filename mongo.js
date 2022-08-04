const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://angusking47:${password}@cluster0.0smdgjo.mongodb.net/phonebook?retryWrites=true&w=majority`

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', PersonSchema)

mongoose
    .connect(url).then(() => {
        if(process.argv.length === 3){
            Person.find({}).then((result) => {
                result.forEach((person) => {
                    console.log(person)
                })
                mongoose.connection.close()
            })
        }
        else if(process.argv.length === 5){

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })

            person.save().then(() => {
                console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
                mongoose.connection.close()
            })

        }
        else{
            console.log('The only way you can use this application is node mongo.js password / node mongo.js password name number')
            mongoose.connection.close()
        }
    })