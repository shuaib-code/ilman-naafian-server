const collected = require("../model/collected")

const getCollection = async(req,res)=>{
    res.send(await collected.find());
}
const postCollection = async(req,res)=>{
    res.send(await collected.create(req.body))
}
const getTotalItem = async(req,res)=>{
    const count = await collected.estimatedDocumentCount()
    res.send({count})
}

module.exports = {getCollection, postCollection, getTotalItem}