const config = require("../config/db.config.js")

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB,config.USER,config.PASSWORD,
    {
        host: config.HOST,
        dialect : config.dialect,
        operatorsAliases: false,

        pool: {
            // maximum number of connection in pool
            max: config.pool.max,
            // minimum number of connection in pool
            min: config.pool.min,
            // maximum time, in milliseconds, that pool will try to get connection before throwing error
            acquire: config.pool.acquire,
            // maximum time, in milliseconds, that a connection can be idle before being released
            idle: config.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize,Sequelize);
db.reserve = require("../models/reserve.model.js")(sequelize,Sequelize);


module.exports = db;