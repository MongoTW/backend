const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 1200; // Server will run on port 1200

app.use(bodyParser.json());

// Variable to store the MongoDB URL
let mongoUrl;

// Endpoint to receive MongoDB URL and connect to the server
app.post('/mongodb-url', (req, res) => {
    mongoUrl = req.body.url;
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log(`Connected to MongoDB at ${mongoUrl}`);
            res.send(true); // Indicate successful connection
        })
        .catch(err => {
            console.error('Error connecting to MongoDB:', err);
            res.status(500).send(false); // Indicate failed connection
        });
});

// Endpoint to check if MongoDB is connected
app.get('/mongodb-status', (req, res) => {
    const status = mongoose.connection.readyState === 1; // 1 means connected
    res.send(status);
});

// Endpoint to insert data into a specific collection
app.post('/insert', (req, res) => {
    const { data, collection } = req.body;
    mongoose.connection.collection(collection).insertOne(data)
        .then(() => res.send('Data inserted successfully'))
        .catch(err => {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
        });
});

// Endpoint to find data in a specific collection
app.post('/find', (req, res) => {
    const { query, collection } = req.body;
    mongoose.connection.collection(collection).findOne(query)
        .then(data => res.json(data))
        .catch(err => {
            console.error('Error finding data:', err);
            res.status(500).send('Error finding data');
        });
});

// Endpoint to delete data from a specific collection
app.post('/delete', (req, res) => {
    const { query, collection } = req.body;
    mongoose.connection.collection(collection).deleteOne(query)
        .then(() => res.send('Data deleted successfully'))
        .catch(err => {
            console.error('Error deleting data:', err);
            res.status(500).send('Error deleting data');
        });
});

// Endpoint to count documents in a specific collection
app.post('/count', (req, res) => {
    const { collection } = req.body;
    mongoose.connection.collection(collection).countDocuments()
        .then(count => res.json(count))
        .catch(err => {
            console.error('Error counting documents:', err);
            res.status(500).send('Error counting documents');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
