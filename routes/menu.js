const express = require('express')
const routes = express.Router()
const model = require('../models')
const Menu = model.Menu

routes.get('/',(req,res)=>{
    res.send('di menu nichhh')
})
module.exports = routes