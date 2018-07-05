const express = require('express')
const routes = express.Router()
const model = require('../models')
const Menu = model.Menu

routes.get('/menu/edit/:id',(req,res)=>{
    Menu.findById(req.params.id)
    .then(menu=>{
        res.render('editMenu',{menu:menu})
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.post('/menu/edit/:id',(req,res)=>{
    Menu.update({
        name:req.body.name,
        price:req.body.price
    },{
        where: {id:req.params.id}
    })
    .then(menu=>{
        res.redirect("/admin/menu")
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/menu/delete/:id',(req,res)=>{
    Menu.destroy({
        where:{
            id:req.params.id
        }
    })
    .then(menu=>{
        res.redirect("/admin/menu")
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/menu/add',(req,res)=>{
   res.render('addMenu') 
})

routes.post('/menu/add',(req,res)=>{
    Menu.create({
        name:req.body.name,
        price:req.body.price
    })
    .then(menu=>{
        res.redirect('/admin/menu')
    })
    .catch(err=>{
        res.json(err)
    })
 })

module.exports = routes