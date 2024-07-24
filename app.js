const express =require('express');   
const app =express() ;     // yha express ek method hai
const port = 3000;
const web = require("./routes/web");      // yha web.js ko app.js se call kiya hai.
const connectDb = require('./db/connectDB')
const cookieParser = require('cookie-parser')


// token get
app.use(cookieParser())


// image upload packege
const fileUpload=require('express-fileupload')

//tempfiles uploaderz
app.use(fileUpload({useTempFiles:true}))



// //connect flash and sessions
 const session =require('express-session')
 const flash = require('connect-flash')

// // message

app.use(session({
    secret: 'secret',
    cookie: {maxAge:60000},
    resave: false,
    saveUninitialized: false,
}))

// flash message
app.use(flash())

//connectdb
connectDb()
 
//data get 
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false}))


//ejs set html css
app.set('view engine','ejs')

//image css link 
app.use(express.static('public'))

//route load
app.use("/", web) ;   // use ek function hai 


//server create
app.listen(port, () => {
    console.log(`Server start http://localhost:${port}`);
})
 