'use strict';
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    username: {
      type:DataTypes.STRING,
      validate:{
        isUserUnique(value,cb){
          User.findAll({
            where: {username:value}
          })
          .then(user=>{
            if(user.length>0){
              cb("username already used")
            }
            else{
              cb()
            }
          })
          .catch(err=>{
            console.log(err);
          })
        }
      }
    },
    password: DataTypes.STRING,
    voucher: {
      type : DataTypes.INTEGER,
      defaultValue: 0
    },
    isAdmin: {
      type : DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    hooks:{
      beforeCreate:(User,option)=>{
        var salt = bcrypt.genSaltSync(5);
        var hash = bcrypt.hashSync(User.password, salt);
        User.password = hash;
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Transaction)
  
  };
  return User;
};