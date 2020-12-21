//insert files
const db = require("../models");
//create database objects
const Reserve = db.reserve;
//Operator Object
const Op = db.Sequelize.Op;
//Config Module
const config = require('../config/reserve.config.js');


function changeTimezone(date, ianatz) {
    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {timeZone: ianatz}));
    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();
    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff); // needs to substract
}


exports.reserve = (req,res)=>{
    var dstart = new Date(req.body.startDate);
    var dend = new Date(req.body.endDate);
    var now = new Date();
    now = changeTimezone(now,"Asia/Tehran");
    let diff = Math.abs(dend.getTime() - now.getTime());
    if(dstart >= dend)
    {
        res.status(300).json({message:"What the **** ?"});
        return;
    }
    //check period
    if(!((dend.getSeconds()-dstart.getSeconds() == 0) && (dend.getMinutes()-dstart.getMinutes() == 0) && (dend.getHours()-dstart.getHours() == config.time_period) && (dend.getDate() == dstart.getDate()) && (dend.getMonth()+1 == dstart.getMonth()+1) && (dend.getFullYear() == dstart.getFullYear()) ))
    {
        res.status(300).json({message:"Input is not in period"});
        return;
    }
    if(Math.ceil(diff / (1000 * 60 * 60 * 24)) > config.day_period)
    {
        res.status(300).json({message:"Must be in this week"});
        return;
    }
    let tempDateStart = new Date(dstart.getTime());
    let tempNow = new Date();
    tempDateStart.setHours(0,0,0,0);
    tempNow.setHours(0,0,0,0);
    if((tempDateStart.getTime()==tempNow.getTime()) && ((dstart.getHours() < now.getHours()) || ((dstart.getHours()==now.getHours()) && dstart.getMinutes() < now.getMinutes())))
    {
        res.status(300).json({message:"Time passed"});
        return;
    }
    //Check if it exists
    Reserve.findAll({
        where:{
            // end_date >= req.body.startDate,
            // start_date <= req.body.endDate
            end_date: {
                [Op.gt]: req.body.startDate
            },
            start_date: {
                [Op.lt]: req.body.endDate
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

exports.getReserves = async(req,res)=>{
    var now = new Date();
    now.setHours(0,0,0,0);
    var reserves = await Reserve.findAll();
    var result = [];
    for(var i=0; i<reserves.length; i++)
    {
        let startDate = new Date(reserves[i].start_date);
        startDate.setHours(0,0,0,0);
        if(startDate >= now)
        {
            result.push(reserves[i]);
        }
    }
    result.push({
        userId: req.userId
    });
    return res.status(200).send(result);
}