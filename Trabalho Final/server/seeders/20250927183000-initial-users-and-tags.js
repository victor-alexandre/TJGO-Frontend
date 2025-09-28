'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // --- 1. Seed Users ---
    // Note: We are assuming the first user will get id: 1, and the second id: 2
    const usersToSeed = [
      {
        id: 1, // Explicitly setting ID for clarity in relationships
        name: 'Victor Coelho',
        email: 'victor.coelho@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2, // Explicitly setting ID for clarity in relationships
        name: 'Maria Souza',
        email: 'maria.souza@example.com',
        password: await bcrypt.hash('password456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Users', usersToSeed, {});

    // --- 2. Seed Tags ---
    const tagsToSeed = [
      { id: 1, name: 'Trabalho', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Pessoal', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Estudos', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Finanças', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Lazer', createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Tags', tagsToSeed, {});

    // --- 3. Seed Contents ---
    const contentsToSeed = [
      {
        id: 1,
        user_id: 1, // Belongs to Victor Coelho
        titulo: 'Relatório Semanal',
        texto: 'Finalizar a apresentação para a reunião de segunda-feira.',
        status: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        user_id: 1, // Belongs to Victor Coelho
        titulo: 'Ideias para o projeto',
        texto: 'Brainstorm de novas funcionalidades para o SGCPD.',
        status: 'em andamento',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        user_id: 2, // Belongs to Maria Souza
        titulo: 'Lista de Compras',
        texto: 'Leite, pão, ovos e frutas.',
        status: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Contents', contentsToSeed, {});

    // --- 4. Seed Associations in Content_Tags ---
    const associationsToSeed = [
      // Relatório Semanal (content_id: 1) gets the 'Trabalho' tag (tag_id: 1)
      { content_id: 1, tag_id: 1, createdAt: new Date(), updatedAt: new Date() },
      // Ideias para o projeto (content_id: 2) gets 'Trabalho' and 'Estudos' tags
      { content_id: 2, tag_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { content_id: 2, tag_id: 3, createdAt: new Date(), updatedAt: new Date() },
      // Lista de Compras (content_id: 3) gets the 'Pessoal' tag (tag_id: 2)
      { content_id: 3, tag_id: 2, createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Content_Tags', associationsToSeed, {});
  },

  async down (queryInterface, Sequelize) {
    // Remove data in reverse order of creation to avoid foreign key errors
    await queryInterface.bulkDelete('Content_Tags', null, {});
    await queryInterface.bulkDelete('Contents', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Tags', null, {});
  }
};