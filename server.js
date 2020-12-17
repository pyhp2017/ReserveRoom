//Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models')
const path = require('path');
var cookieParser = require('cookie-parser')

//Create an Instance of express
const app = express();

//set cors options
var corsOptions = {
    origin: "http://localhost:8081"
};
//set cors with its options into app
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// Set Cookie
app.use(cookieParser())
  


//Just For Development :
// db.sequelize.sync({force:true}).then(()=>{
//     console.log("Drop and Resync Db");
// });

db.sequelize.sync();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Main Path
app.get('/', (req, res) => {
    if(req.cookies.auth)
    {
        res.render('index',{title:'ReserveAPP-Loggedin',req:req})
    }
    res.render('index',{title:'ReserveAPP',req:req});
});




//Route for api
require('./routes/auth.routes.js')(app);
require('./routes/reserve.routes.js')(app);



app.get('/login', (req,res)=>{
    res.render('login',{title:'Login Page'});
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.get('/logout',(req,res)=>{
    res.clearCookie('auth', { path: '/' })
    res.redirect('/');
})


//Set Port and Start Listening
const port = 8080;
app.listen(port,()=>{
    console.log('Serve is running on port: ' + port);
});