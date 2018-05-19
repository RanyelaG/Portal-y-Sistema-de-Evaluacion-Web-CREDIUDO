'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Personals', [{
      cedula: '24513326',
      nombre: 'Ranyela',
     // password: '9079dbe1a6d61c66bc2bd12552eacf2fd82f4d7facab8b8fc8be178b2adc1414',
      role:'manager',
      salt: 'bMqOztQx',
    //  codigo_nucleo: '1',
     // role:'manager',
      createdAt: new Date(),
      updatedAt: new Date(),
     // salt: 'bMqOztQx'
    }]);
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
