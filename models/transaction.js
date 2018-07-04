'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    UserId: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue:"checkout"
    },
    eta: DataTypes.INTEGER,
    arrivalTime: DataTypes.INTEGER,
    cash: DataTypes.INTEGER,
    voucher: DataTypes.INTEGER,
    total: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsToMany(models.Menu,{through:models.MenuTransaction}),
    Transaction.belongsTo(models.User)

  };
  return Transaction;
};