//Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser')
const tokenValidModule = require('./middleware/authJwt')
const db = require('./models')
const path = require('path');

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
// Set Cookie Parser
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
    var booleanToken = tokenValidModule.isValidToken(req.cookies.auth);
    if(req.cookies.auth&&booleanToken)
    {
        console.log("VALID")
        res.render('index',{title:'ReserveAPP-Loggedin',token:true})    
    }
    else
    {
        console.log("Not Valid");
        res.render('index',{title:'ReserveAPP',token:false});
    }
});




//Route for api
require('./routes/auth.routes.js')(app);
require('./routes/reserve.routes.js')(app);



app.get('/login', (req,res)=>{
    var booleanToken = tokenValidModule.isValidToken(req.cookies.auth);
    if(!(req.cookies.auth && booleanToken))
    {
        res.render('login',{title:'Login Page'});
    }
    else
    {
        res.redirect('/');
    }
})

app.get('/signup',(req,res)=>{
    var booleanToken = tokenValidModule.isValidToken(req.cookies.auth);
    if(!(req.cookies.auth && booleanToken))
    {
        res.render('signup');
    }
    try
    {
        res.redirect('/');
    }
    catch(ex){}
})

app.get('/logout',(req,res)=>{
    var booleanToken = tokenValidModule.isValidToken(req.cookies.auth);
    if(req.cookies.auth && booleanToken)
    {
        res.clearCookie('auth', { path: '/' })
    }
    res.redirect('/');
})


//Set Port and Start Listening
const port = 9090;
app.listen(port,()=>{
    console.log('Serve is running on port: ' + port);
});