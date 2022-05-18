const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s862v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






async function run() {
    try {
        await client.connect();
        const toDoCollection = client.db('toDo').collection('tusks')

        app.get('/tusk', async (req, res) => {
            const query = {};
            const cursor = toDoCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })



        //POST
        app.post('/tusk', async (req, res) => {
            const newCar = req.body;
            const result = await toDoCollection.insertOne(newCar);
            res.send(result);
        })

        //DELETE
        app.delete('/tusk/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toDoCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/tusk/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: { complete: true }
            }
            const result = await toDoCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })



    }
    finally {

    }
}
run().catch(console.dir);


//To check is it working
app.get('/', (req, res) => {
    res.send('Running Server');
});

//listen
app.listen(port, () => {
    console.log('Listening to port', port);
})