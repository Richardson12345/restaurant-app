const express = require('express')
const app = express()
const model = require('./models')
const User = model.User
const Transaction = model.Transaction
const Menu = model.Menu
const MenuTransaction = model.MenuTransaction
const mails = require('./nodeMailer.js')

const session = require('express-session')
const bcrypt = require('bcrypt')

const user = require('./routes/user.js')
const transaction = require('./routes/transaction.js')
const menu = require('./routes/menu.js')
const admin = require('./routes/userAdmin.js')
const port = process.env.PORT || 3000;

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.locals.fullNameHelper = require('./helper/fullName.js')

app.use(session({secret:"thisIsSecret",resave:false,saveUninitialized:true}))


app.get('/',(req,res)=>{
    if(req.session.user){
        res.redirect('/home/admin')
    }
    else{
        res.render('login',{err:null})
    }
})

app.get('/home',(req,res)=>{
    if(req.session.user){
        res.redirect('/home/admin')
    }
    else{
        res.render('login',{err:null})
    }
})

app.get('/login',(req,res)=>{
    if(req.session.user){
        res.redirect('/home/admin')
    }
    else{
        res.render('login',{err:null})
    }
})


app.post('/login',(req,res)=>{
    User.findAll({
        where: {
            username : req.body.username
        }
    })
    .then(user=>{
        if(user.length>0){
            var success = bcrypt.compareSync(req.body.password, user[0].password)
            if(user[0].password==req.body.password){
                req.session.user = user[0]
                res.redirect('/home/admin')
            }
            else if(success){
                req.session.user = user[0]
                res.redirect('/home/admin')
            }
            else{
                res.render('login',{err:"incorrect password/username"})
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

app.get('/logout',(req,res)=>{
    delete req.session.user
    delete req.session.TransactionId
    res.redirect('/')
})

app.get('/register',(req,res)=>{
    res.render('addUser',{err:null})
})

app.post('/register',(req,res)=>{
    User.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        address:req.body.address,
        city:req.body.city,
        username:req.body.username,
        password:req.body.password
    })
    .then(users=>{
        mails(req.body.email,req.body.firstName)
        res.redirect('/login')
    })
    .catch(err=>{
        console.log(err.message.split(':')[1]);
        
        res.render('addUser',{err:err.message})
    })
})

app.use('/',admin)


app.get('/home/user',(req,res)=>{
        res.render('home-user')
})


app.use('/',menu)

app.use('/',user)


app.use('/',transaction)

app.use('/test',(req,res)=>{
    res.json(req.session)
})


app.listen(port, function(){
    console.log(`Server Starts on ${port}`)
})
