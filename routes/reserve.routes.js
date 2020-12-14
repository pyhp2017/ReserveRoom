const {authJwt} = require("../middleware");
const controller = require("../controllers/reserve.controller.js");


module.exports = (app)=>{
    app.use((req,res,next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
        next();
    });

    app.post("/api/reserve" , [authJwt.verifyToken] , controller.reserve);
}