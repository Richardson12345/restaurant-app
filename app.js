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

app.get('/home/admin',(req,res)=>{
    res.render('home-admin')
})

app.use('/',admin)


app.get('/home/user',(req,res)=>{
    res.send("tampilan home dari user")
})

app.use('/user',user)



app.use('/transaction',transaction)
app.use('/menu',menu)



app.listen(3000)