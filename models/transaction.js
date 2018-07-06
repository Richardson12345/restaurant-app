'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    UserId: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue:"checkout"
    },
    eta: {
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    arrivalTime: {
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    cash: DataTypes.INTEGER,
    voucher: {
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    total: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsToMany(models.Menu,{through:models.MenuTransaction}),
    Transaction.belongsTo(models.User)

  };

  Transaction.prototype.ArrivalTime = function(){
    var hourUpdated = (this.updatedAt.getHours())*60
    var hourCreated = (this.createdAt.getHours())*60
    var minutesUpdate = this.updatedAt.getMinutes()
    var minutesCreate = this.createdAt.getMinutes()
    var Update = hourUpdated+minutesUpdate
    var Create = hourCreated+minutesCreate
    var arrival = Update-Create
    return arrival
  }

  Transaction.prototype.LateTransaction  = function(){
    var countLateTrans = this.arrivalTime - this.eta
    if(countLateTrans>0){
      return countLateTrans
    }
    else{
      return 0
    }
  }
  return Transaction;
};