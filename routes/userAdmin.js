const express = require('express')
const routes = express.Router()
const model = require('../models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu

routes.get('/',(req,res)=>{
    res.send('diuser admin nichhh')
})

routes.get('/admin/order',(req,res)=>{
    // res.send("table order dari admin")
    Transaction.findAll({
        include:[
            {model:User},
            {model:Menu}
        ]})
    .then(transactions=>{
        // res.json(transactions)

        res.render('statusOrder',{transactions:transactions})
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/admin/order/:id',(req,res)=>{
    res.render('editStatus',{id:req.params.id})
})
routes.post('/admin/order/:id',(req,res)=>{
    Transaction.update({
        status:req.body.status
    },{
        where: {id:req.params.id}
    })

    .then(transaction=>{
        res.redirect('/admin/order')
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/admin/add-menu',(req,res)=>{
    res.send("add menu dari admin")
})



module.exports = routes