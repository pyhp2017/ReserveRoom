//Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models')

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


//Just For Development :
db.sequelize.sync({force:true}).then(()=>{
    console.log("Drop and Resync Db");
});


//Route to main path
app.get('/',(req,res)=>{
    res.json({message:"Welcome to main Page"})
});


//Set Port and Start Listening
const port = 8080;
app.listen(port,()=>{
    console.log('Serve is running on port: ' + port);
});