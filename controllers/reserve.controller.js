//insert files
const db = require("../models");
//create database objects
const Reserve = db.reserve;
//Operator Object
const Op = db.Sequelize.Op;
//Config Module
const config = require('../config/reserve.config.js');


exports.reserve = (req,res)=>{
    var dstart = new Date(req.body.startDate);
    var dend = new Date(req.body.endDate);
    if(dstart >= dend)
    {
        res.status(300).json({message:"What the **** ?"});
        return;
    }
    //check period
    if(!((dend.getSeconds()-dstart.getSeconds() == 0) && (dend.getMinutes()-dstart.getMinutes() == 0) && (dend.getHours()-dstart.getHours() == config.time_period) && (dend.getDay() == dstart.getDay()) && (dend.getMonth() == dstart.getMonth()) && (dend.getFullYear() == dstart.getFullYear()) ))
    {
        res.status(300).json({message:"Input is not in period"});
        return;
    }
    //Check if it exists
    Reserve.findAll({
        where:{
            // end_date >= req.body.startDate,
            // start_date <= req.body.endDate
            end_date: {
                [Op.gte]: req.body.startDate
            },
            start_date: {
                [Op.lte]: req.body.endDate
            }
        }
    }).then(reserves=>{
        if(reserves.length != 0)
        {
            res.status(300).json({message:"time is reserved!"});
            return;
        }
        Reserve.create({
            user_id: req.userId,
            start_date: req.body.startDate,
            end_date: req.body.endDate
        }).then(reserve=>{
            res.send("Created");
        }).catch(err=>{
            res.status(500).send({message:err.message});
        });
    
    }).catch(err=>{
        res.status(500).send({message:err.message});
    });
}