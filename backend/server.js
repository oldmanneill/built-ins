const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const quoteRoutes = express.Router();
const PORT = process.env.PORT || 4000;
const mongoDBURL = 'mongodb://M_LAB_USER:M_LAB_PASSWORD@ds227185.mlab.com:27185/bookcases'

let Quote = require('./quote.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoDBURL)//, { useNewUrlParser: true })//'mongodb://127.0.0.1:27017/quotes', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

quoteRoutes.route('/').get(function(req, res) {
    Quote.find(function(err, quotes) {
        if (err) {
            console.log(err);
        } else {
            res.json(quotes);
        }
    });
});

// todoRoutes.route('/:id').get(function(req, res) {
//     let id = req.params.id;
//     Todo.findById(id, function(err, todo) {
//         res.json(todo);
//     });
// });

// todoRoutes.route('/update/:id').post(function(req, res) {
//     Todo.findById(req.params.id, function(err, todo) {
//         if (!todo)
//             res.status(404).send("data is not found");
//         else
//             todo.todo_description = req.body.todo_description;
//             todo.todo_responsible = req.body.todo_responsible;
//             todo.todo_priority = req.body.todo_priority;
//             todo.todo_completed = req.body.todo_completed;

//             todo.save().then(todo => {
//                 res.json('Todo updated!');
//             })
//             .catch(err => {
//                 res.status(400).send("Update not possible");
//             });
//     });
// });

quoteRoutes.route('/add').post(function(req, res) {
    let quote = new Quote(req.body);
    quote.save()
        .then(quote => {
            res.status(200).json({'quote': 'quote added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new quote failed');
        });
});

app.use('/quotes', quoteRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});