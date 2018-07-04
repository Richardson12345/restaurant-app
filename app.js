const express = require('express')
const app = express()
const model = require('./models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu

const user = require('./routes/user.js')
const transaction = require('./routes/transaction.js')
const menu = require('./routes/menu.js')
const admin = require('./routes/userAdmin.js')


app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))

app.locals.fullNameHelper = require('./helper/fullName.js')

app.get('/',(req,res)=>{
    // res.send("home")
    res.render('login',{err:null})
})

app.get('/newAccount',(req,res) =>{
    res.render('newAccount')
})

app.post('/newAccount', (req,res)=>{
    let admin = req.body.isAdmin;
    if(admin == "true"){
        let obj = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            address : req.body.address,
            city : req.body.city,
            username : req.body.username,
            password : req.body.password,
            voucher : req.body.voucher,
            isAdmin : 1
        }
        model.User.create(obj)
        .then(()=>{
            res.redirect('/')
        })
        .catch((err)=>{
            res.json(err)
        })
    }else{
        let obj = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            address : req.body.address,
            city : req.body.city,
            username : req.body.username,
            password : req.body.password,
            voucher : req.body.voucher
        }
        model.User.create(obj)
        .then(()=>{
            res.redirect('/')
        })
        .catch((err)=>{
            res.json(err)
        })
    }
})  

app.get('/login',(req,res)=>{
    // res.send("home")
    res.render('login',{err:null})
})

app.get('/register',(req,res)=>{
    // res.send("masuk new account")
    res.render('addUser')
})

app.post('/login',(req,res)=>{
    User.findAll({
        where: {
            username : req.body.username,
            password : req.body.password
        }
    })
    .then(user=>{
        if(user.length>0){
            // res.send('berhasil masuk')
            if(user[0].isAdmin==1){
                // res.send('masuk admin')
                res.redirect('/home/admin')
            }
            else{
                // res.send("bukan admin")
                res.redirect('/home/user')
            }
        }
        else{
            res.render('login',{err:"incorrect password/username"})
        }
    })
    .catch(err=>{
        res.json(err)
    })
})

app.get('/admin/order',(req,res)=>{
    res.render("addMenu")
})

app.post('/admin/add-menu',(req,res)=>{
    model.Menu.create(
        {
            name: req.body.name,
            price: req.body.price
        }
    ).then(()=>{
        res.render('addedMenu', {
            name : req.body.name
        })
    })
})

app.get('/home/admin',(req,res)=>{
    res.render('home-admin')
})

app.use('/',admin)


app.get('/home/user',(req,res)=>{
    res.render('homeUser.ejs')
})

app.get('/menuList', (req,res)=>{
    model.Menu.findAll({})
    .then((itemArr)=>{
        res.render('menu', {
            itemArr
        })
    })
    .catch((err)=>{
        res.json(err)        
    })
})

app.use('/user',user)



app.use('/transaction',transaction)
app.use('/menu',menu)



app.listen(3000)