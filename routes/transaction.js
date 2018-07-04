const express = require('express')
const routes = express.Router()
const model = require('../models')
const Transaction = model.Transaction

routes.get('/',(req,res)=>{
    res.send('di transaction nichhh')
})
module.exports = routes