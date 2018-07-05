const express = require('express')
const routes = express.Router()
const model = require('../models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu

routes.get('/home/admin',(req,res,next)=>{
    if(req.session.user){
        if(req.session.user.isAdmin==1){
            res.render('home-admin')
        }
        else{
            res.redirect('/home/user')
        }
    }
    else{
        next()
    }
},(req,res)=>{
    res.redirect('/login')
})

routes.get('/admin/order',(req,res)=>{
    Transaction.findAll({
        include:[
            {model:User},
            {model:Menu}
        ],order:[['id','asc']]})
    .then(transactions=>{
        res.render('statusOrder',{transactions:transactions})
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/admin/order/:id',(req,res)=>{
    Transaction.findById(req.params.id)
    .then(transaction=>{
        res.render('editStatus',{transaction:transaction})
    })
    .catch(err=>{
        res.json(err)
    })
})
routes.post('/admin/order/:id',(req,res)=>{
    if(req.body.status=="complete"){
        Transaction.findById(req.params.id)
        .then(transaction=>{
            Transaction.update({
                status:req.body.status,
                arrivalTime:transaction.ArrivalTime()
            },{
                where: {id:req.params.id}
            })
            .then(id=>{
                Transaction.find({
                    where: {id:req.params.id},
                    include : [User]
                })
                .then(transaction=>{
                    var lateCount = transaction.LateTransaction()
                    if(lateCount>0){
                        var voucher = transaction.User.voucher+25000
                        console.log(voucher);
                        console.log(transaction.User.id);
                        
                        User.update({
                            voucher:voucher
                        },{
                            where : {id:transaction.User.id}
                        })
                        .then(id=>{
                            console.log("masuk voucher");
                            res.redirect('/admin/order')
                        })
                        .catch(err=>{
                            res.json(err)
                        })
                    }
                    else{
                        res.redirect('/admin/order')
                    }
                })
                .catch(err=>{
                    res.json(err)                    
                })
            })
            .catch(err=>{
                res.json(err)
            })
        })
        .catch(err=>{
            res.json(err)
        })
    }
    else{
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
    }
})

routes.get('/admin/menu',(req,res)=>{
    Menu.findAll({order:[['id','asc']]})
    .then(menus=>{
        res.render('menuTable',{menus:menus})
    })
    .catch(err=>{
        res.json(err)
    })
})



module.exports = routes