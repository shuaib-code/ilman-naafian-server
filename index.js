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
    const collected = client.db('ilman-naafian').collection('collected');
    const readList = client.db('ilman-naafian').collection('readList');
    const wishList = client.db('ilman-naafian').collection('wishList');

    app.post('/collect', async (req, res) => res.send(await collected.insertOne(req.body)));
    app.post('/readlist',async(req,res)=> res.send(await readList.insertOne(req.body)))
    app.post('/wishlist', async (req, res) => res.send(await wishList.insertOne(req.body)));

    app.get('/search',async(req,res)=>{
        const bookList = await collected.find().toArray();
        res.send(bookList.filter(e=>e.bookName.includes(req.query.search)))
    })
    app.get('/totalitem',async(req,res)=>{
        const count = await collected.estimatedDocumentCount();
        res.send({count});
    })

    app.get('/collect',async(req,res)=>{
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        const cursor = await collected.find().skip(page*size).limit(size).toArray();
        res.send(cursor);
    })
    app.get('/readlist',async(req,res)=> res.send(await readList.find().toArray()))
    app.get('/wishlist',async(req,res)=> res.send(await wishList.find().toArray()))

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

    app.patch('/note/:id',async(req,res)=> res.send(await readList.updateOne({_id: new ObjectId(req.params.id)}, {$set:{note: req.body.newNote}})))
    app.delete('/collect/:id',async(req,res)=> res.send(await collected.deleteOne({_id: new ObjectId(req.params.id)})))
    app.delete('/note/:id', async (req, res) => res.send(await readList.deleteOne({ _id: new ObjectId(req.params.id) })));
    app.delete('/wishlist/:id',async(req,res)=> res.send(await wishList.deleteOne({_id: new ObjectId(req.params.id)})))

} finally {}}
run().catch(console.dir);

app.all('*', (req, res) => res.send({ message: `[${req.url}] is not found.` }));


app.get('/',(req,res)=>res.send('Ilman-Naafian Server is running...'));
app.listen(port, ()=>console.log(`Ilman-Naafian PORT: ${port}`));
