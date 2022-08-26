if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express');
const bcrypt = require ('bcrypt');
const passport= require ('passport')
const flash = require ('express-flash')
const session = require ('express-session')
const initializePassword = require('./password.config.js')
const app = express()

initializePassword(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.render('hello.ejs')
})

app.get('/login',(req,res)=>{
    res.render('log.ejs')
})

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',(req,res)=>{
    res.render('code.ejs')
})

const users = []

app.post('/register',async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

app.listen(3001)
