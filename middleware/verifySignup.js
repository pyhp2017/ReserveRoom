const db = require("../models");
const User = db.user;

function check(req,res){
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user=>{
        if(user)
        {
            console.log("USER")
            return false;
        }
        User.findOne({
            where:{
                email: req.body.email
            }
        }).then(email=>{
            if(email)
            {
                console.log("Email")
                return false;
            }
        });
    });
    return true;
}


usernameOrEmailExists = (req,res,next)=>{
    if(!check(req,res))
    {
        res.status(400).send({
        message: "Failed! Email Or Username is already in use!"
        });
        return;
    }
    else
    {
        next();
    }
};

usernameOrEmailExistsFront = (req,res,next)=>{
    if(!check(req,res))
    {
        res.redirect('/signup');
    }
    else
    {
        next();
    }
}


const verifySignup = {
    usernameOrEmailExists : usernameOrEmailExists,
    usernameOrEmailExistsFront: usernameOrEmailExistsFront
};

module.exports = verifySignup;