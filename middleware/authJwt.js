const jwt = require("jsonwebtoken");
const config = require("../config/auth.cofig.js");

verifyToken = (req,res,next)=>{
    let token = req.headers["x-access-token"];
    if(!token)//header didn't exist
    {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token,config.secret, (error,decoded)=>{
        if(error)
        {
            return res.status(401).send({
                message: "Unauthorized"
            });
        }
        req.userId = decoded.id;
        next();
    });
};


const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;