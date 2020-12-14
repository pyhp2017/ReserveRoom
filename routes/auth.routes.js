const {verifySignup} = require("../middleware")
const controller = require("../controllers/auth.controller")
// const 

module.exports = (app)=>{
    app.use((req,res,next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    });
    
    app.post("/api/auth/signup",[verifySignup.usernameOrEmailExists,verifySignup.roleExists],controller.signup);
    app.post("/api/auth/signin",controller.signin);
};