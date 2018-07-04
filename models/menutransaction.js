'use strict';
module.exports = (sequelize, DataTypes) => {
  var MenuTransaction = sequelize.define('MenuTransaction', {
    TransactionId: DataTypes.INTEGER,
    MenuId: DataTypes.INTEGER
  }, {});
  MenuTransaction.associate = function(models) {
    // associations can be defined here
    MenuTransaction.belongsTo(models.Menu),
    MenuTransaction.belongsTo(models.Transaction)
  };
  return MenuTransaction;
};