const express = require('express')
const routes = express.Router()
const model = require('../models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu
const MenuTransaction = model.MenuTransaction


routes.get('/user',(req,res)=>{
    res.json(req.session.user)
})
routes.get('/user/menu',(req,res)=>{
    Menu.findAll()
    .then(menus=>{
        res.render('menuUser',{menus:menus})
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/user/menu/:id',(req,res)=>{
    if(!req.session.TransactionId){
        Transaction.create({
            UserId:req.session.user.id
        })
        .then(transaction=>{
            req.session.TransactionId = transaction.id
            MenuTransaction.create({
                TransactionId:req.session.TransactionId,
                MenuId:req.params.id
            })
            .then(menutrans=>{
                res.redirect('/user/menu')
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
        MenuTransaction.create({
            TransactionId:req.session.TransactionId,
            MenuId:req.params.id
        })
        .then(menutrans=>{
            res.redirect('/user/menu')
        })
        .catch(err=>{
            res.json(err)
        })
    }
})


routes.get('/user/cart',(req,res)=>{
    MenuTransaction.findAll({attributes:['id'],
        where:{TransactionId:req.session.TransactionId},
        include:['Menu']
    })
    .then(menuTrans=>{
        var voucher = req.session.user.voucher
        req.session.voucher = voucher
        var total = 0
        for(var i = 0; i < menuTrans.length; i++){
            total += menuTrans[i].Menu.price
        }
        req.session.total = total
        res.render('cart',{menuTrans:menuTrans,voucher:voucher,total:total,change:null,err:null})
        // res.json(menuTrans)
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/user/cart/delete/:id',(req,res)=>{
    MenuTransaction.destroy({
        where:{
            id:req.params.id
        }
    })
    .then(trans=>{
        res.redirect('/user/cart')
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.post('/user/cart/voucher',(req,res)=>{
    MenuTransaction.findAll({attributes:['id'],
        where:{TransactionId:req.session.TransactionId},
        include:['Menu']
    })
    .then(menuTrans=>{
        var voucher = req.session.user.voucher
        var total = 0
        for(var i = 0; i < menuTrans.length; i++){
            total += menuTrans[i].Menu.price
        }
        var bill = total-voucher
        if(total!==0){
            if(bill<=0){
                bill = 0
                Transaction.update({
                    voucher:total
                },{
                    where:{id:req.session.TransactionId}
                })
                .then()
                .catch(err=>{
                    res.json(err)
                })
            }
            else{
                Transaction.update({
                    voucher:voucher
                },{
                    where:{id:req.session.TransactionId}
                })            
                .then()
                .catch(err=>{
                    res.json(err)
                })
            }
            User.update({
                voucher:0
            },{
                where:{id:req.session.user.id}
            })
            .then(user=>{
                req.session.total = bill
                req.session.voucher = 0
                res.render('cart',{menuTrans:menuTrans,voucher:0,total:bill,change:null,err:null})
            })
            .catch(err=>{
                res.json(err)
            })
        }
        else{
            res.redirect('/user/cart')
        }

    })
    .catch(err=>{
        res.json(err)
    })
})


routes.post('/user/cart/total',(req,res)=>{
    MenuTransaction.findAll({attributes:['id'],
        where:{TransactionId:req.session.TransactionId},
        include:['Menu']
    })
    .then(menuTrans=>{
        var voucher = req.session.voucher
        var total = req.session.total
        var cash = req.body.cash
        var bill = cash-total
        var tot = 0
        if(cash>total){
            cash = total
        }
        else{
            cash = cash
        }
        for(var i = 0; i < menuTrans.length; i++){
            tot += menuTrans[i].Menu.price
        }
        if(bill<0){
            var err = "uang anda kurang"
            res.render('cart',{menuTrans:menuTrans,voucher:voucher,total:total,change:bill,err:err})
        }
        else{
            // cash = tot-total
            Transaction.update({
                cash:cash,
                total:tot
            },{
                where:{id:req.session.TransactionId}
            })
            .then(trans=>{
                res.render('cart',{menuTrans:menuTrans,voucher:voucher,total:total,change:bill,err:null})
            })
            .catch(err=>{
                res.json(err)
            })
        }
    })
    .catch(err=>{
        res.json(err)
    })
})

routes.get('/user/transaction',(req,res)=>{
    Transaction.findAll({
        where:{UserId:req.session.user.id}
    })
    .then(transactions=>{
        res.render('transaction',{transactions:transactions})
    })
    .catch(err=>{
        res.json(err)
    })
})

// routes.get('/user/transaction/detail/:id',(req,res)=>{
//     Transaction.findAll({
//         include:['MenuTransaction'],
//         where: {id:req.params.id}
//     })
//     .then(trans=>{
//         res.json(trans)
//     })
// })

routes.get('/user/edit',(req,res)=>{
    User.findById(req.session.user.id)
    .then(user=>{
        res.render('editUser',{user:user,err:null})
    })
})

routes.post('/user/edit',(req,res)=>{
    User.update({
        firstName:req.body.firstName,
        lastName:req.body.firstName,
        address:req.body.address,
        city:req.body.city,
        password:req.body.password
    },{
        where: {id:req.session.user.id}
    })
    .then(user=>{
        res.render('updatedUser')
        // res.redirect("/home/user")
    })
    .catch(err=>{
        User.findById(req.session.user.id)
        .then(user=>{
            res.render('editUser',{user:user,err:err.message})
        })
    })
})

module.exports = routes