//import modules
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
//import files
const db = require("../models");
const config = require("../config/auth.cofig");
//get database objects
const User = db.user;

//Signup Controller
exports.signup = (req,res)=>{
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,8)
    }).then(user =>{
        res.json({message:"User was registered successfully!"})
    }).catch(err=>{
        res.status(500).send({message: err.message});
    });
};

//Signin controller
exports.signin = (req,res)=>{
    User.findOne({
        where:{
            username: req.body.username
        }
    }).then(user=>{
        if(!user)
        {
            return res.status(404).send({message:"User Not Found"});
        }
        var isPasswordValid = bcrypt.compareSync(req.body.password,user.password);
        if(!isPasswordValid)
        {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password"
            });
        }
        var token = jwt.sign({id: user.id}, config.secret, {expiresIn:86400});
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token
        });
    }).catch(err=>{
        res.status(500).send({message:err.message});
    });
};