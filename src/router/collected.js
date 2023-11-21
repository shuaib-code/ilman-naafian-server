const { getCollection, postCollection, getTotalItem } = require("../controller/collected")
const router = require("express").Router()

router.get('/collect', getCollection)
router.post('/collect', postCollection)
router.get('/totalitem', getTotalItem)

module.exports = router