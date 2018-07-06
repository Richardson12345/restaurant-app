'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
    Add altering commands here.
    Return a promise to correctly handle asynchronicity.
    
    Example:
    return queryInterface.bulkInsert('Person', [{
      name: 'John Doe',
      isBetaMember: false
    }], {});
    */
   return queryInterface.bulkInsert('Users',[{
     firstName : "Richardson",
     lastName : "tjongirin",
     address : "balalsdld",
     city: "jakarta",
     username : "woof",
     password : "doge",
     voucher : 0,
     isAdmin : 1,
     createdAt : new Date(),
     updatedAt: new Date()

   }])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
