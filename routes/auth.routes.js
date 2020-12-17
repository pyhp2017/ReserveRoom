const {verifySignup} = require("../middleware")
const controller = require("../controllers/auth.controller")

module.exports = (app)=>{
    app.use((req,res,next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    });
    app.post("/api/auth/signup",[verifySignup.usernameOrEmailExists],controller.signup);
    app.post("/api/auth/signin",controller.signin);
    app.post("/loginRoute",controller.signinFront);
    app.post("/signupRoute",[verifySignup.usernameOrEmailExists],controller.signup);
};