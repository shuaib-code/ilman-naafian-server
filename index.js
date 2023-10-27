const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d5sxqgi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }});

async function run() {
  try {
    // await client.connect();
    const collected = client.db('ilman-naafian').collection('collected');
    const readList = client.db('ilman-naafian').collection('readList');
    const wishList = client.db('ilman-naafian').collection('wishList');

    app.post('/collect',async(req,res)=>{
        const book = req.body;
        const result = await collected.insertOne(book);
        res.send(result);
    })
    app.post('/readlist',async(req,res)=>{
        const book = req.body;
        const result = await readList.insertOne(book);
        res.send(result);
    })
    app.post('/wishlist',async(req,res)=>{
        const book = req.body;
        const result = await wishList.insertOne(book);
        res.send(result);
    })

    app.get('/collect',async(req,res)=>{
        const cursor = collected.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/readlist',async(req,res)=>{
        const cursor = readList.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/wishlist',async(req,res)=>{
        const cursor = wishList.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.put('/collect/:id',async(req,res)=>{
        const book = req.body;
        const options= { upsert: true};
        const filter = {_id: new ObjectId(req.params.id)};
        const updateBook = {
            $set:{
                bookName: book.bookName,
                author: book.author,
                pub: book.pub,
                cat: book.cat,
                url: book.url
            }
        }
        const result = await collected.updateOne(filter,updateBook,options);
        res.send(result);
    })

    app.patch('/note/:id',async(req,res)=>{
        const filter = {_id: new ObjectId(req.params.id)};
        const updateNote = {
            $set:{
                note: req.body.newNote
            }
        }
        const result = await readList.updateOne(filter, updateNote);
        res.send(result);
    })

    app.delete('/collect/:id',async(req,res)=>{
        const filter = {_id: new ObjectId(req.params.id)};
        const result = await collected.deleteOne(filter);
        res.send(result);
    })
    app.delete('/note/:id', async(req,res)=>{
        const filter = {_id: new ObjectId(req.params.id)};
        const result = await readList.deleteOne(filter);
        res.send(result);
    })
    app.delete('/wishlist/:id',async(req,res)=>{
        const filter = {_id: new ObjectId(req.params.id)};
        const result = await wishList.deleteOne(filter);
        res.send(result)
    })

  } finally {   // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>res.send('Ilman-Naafian Server is running...'));
app.listen(port, ()=>console.log(`Ilman-Naafian PORT: ${port}`));
