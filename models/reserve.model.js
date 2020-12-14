module.exports = (sequelize , Sequelize)=>{
    const Reserve = sequelize.define("reserves",{
        user_id:{
            type: Sequelize.INTEGER
        },
        start_date:{
            type: Sequelize.DATE
        },
        end_date:{
            type: Sequelize.DATE
        }
    });
    return Reserve;
};