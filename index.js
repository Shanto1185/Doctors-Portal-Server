const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oedwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('database connected');
        const datebase = client.db('doctors_portal');
        const appoinmentCollection = datebase.collection('appoinments');

        //post api
        app.post('/appoinments', async (req, res) => {
            const appoinmet = req.body;
            const result = await appoinmentCollection.insertOne(appoinmet)
            console.log(result);
            res.json(result);
        })

        //get api
        app.get('/appoinments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString()

            const query = { email: email, date: date }
            // console.log(query)
            const cursor = appoinmentCollection.find(query)
            const appoinment = await cursor.toArray();
            res.json(appoinment)
        })
    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Doctors Portal')
})

app.listen(port, () => {
    console.log('i am listining port no', port);
})