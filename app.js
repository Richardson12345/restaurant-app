const express = require('express')
const app = express()
const model = require('./models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu

const session = require('express-session')
// const bcrypt = require('bcrypt')

const user = require('./routes/user.js')
const transaction = require('./routes/transaction.js')
const menu = require('./routes/menu.js')
const admin = require('./routes/userAdmin.js')


app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.locals.fullNameHelper = require('./helper/fullName.js')

app.use(session({secret:"thisIsSecret",resave:false,saveUninitialized:true}))


app.get('/',(req,res)=>{
    // res.send("home")
    res.render('login',{err:null})
})

// app.get('/test',(req,res)=>{
//     User.update({
//         firstName : "setiaa"
//     },{
//         where : {id:3}
//     })
//     .then(user=>{
//         res.json(user)
//     })
//     .catch(err=>{
//         console.log(err);
        
//         res.json(err)
//     })
// })

app.get('/login',(req,res)=>{
    // res.send("home")

    req.session.user = null
    res.render('login',{err:null})
})


app.post('/login',(req,res)=>{
    req.session.user = null
    // let success = bcrypt.compareSync(password, login.password)
    User.findAll({
        where: {
            username : req.body.username,
            password : req.body.password
        }
    })
    .then(user=>{
        if(user.length>0){
            req.session.user = user[0]
            res.redirect('/home/admin')
        }
        else{
            res.render('login',{err:"incorrect password/username"})
        }
    })
    .catch(err=>{
        res.json(err)
    })
})

app.get('/register',(req,res)=>{
    // res.send("masuk new account")
    res.render('addUser',{err:null})
})

app.post('/register',(req,res)=>{
    // res.send(req.body.lastName)
    User.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        address:req.body.address,
        city:req.body.city,
        username:req.body.username,
        password:req.body.password
    })
    .then(users=>{
        res.redirect('/login')
    })
    .catch(err=>{
        console.log(err.message.split(':')[1]);
        
        res.render('addUser',{err:err.message})
    })
})

app.use('/',admin)


app.get('/home/user',(req,res)=>{
    // res.send('diuser nichhh')
    res.json(req.session.user)

    // res.send("tampilan home dari user")
})

app.use('/',menu)

app.use('/',user)


app.use('/',transaction)



app.listen(3000)