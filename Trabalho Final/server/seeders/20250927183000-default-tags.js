'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed Tags com uma lista expandida
    await queryInterface.bulkInsert('Tags', [
      { id: 1, name: 'Trabalho', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Pessoal', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Estudos', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Urgente', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Casa', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Ideias', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Finanças', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Saúde', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Lazer', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Sincroniza a sequência de IDs da tabela Tags para evitar conflitos.
    // O name da sequência no PostgreSQL é geralmente "TableName_id_seq"
    await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"Tags"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Tags";`);
  },

  async down(queryInterface, Sequelize) {
    // O comando 'down' remove apenas as tags
    await queryInterface.bulkDelete('Tags', null, {});
  }
};