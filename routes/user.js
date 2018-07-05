const express = require('express')
const routes = express.Router()
const model = require('../models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu

routes.get('/',(req,res)=>{
    res.send('diuser nichhh')
})

routes.get('/user',(req,res)=>{
    res.json(req.session.user)
})
module.exports = routes