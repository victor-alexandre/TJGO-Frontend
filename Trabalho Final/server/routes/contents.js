// server/routes/contents.js
const express = require('express');
const { Content, Tag, sequelize } = require('../models'); // Import Tag e sequelize para transações

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contents
 *   description: API para gerenciar conteúdos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID da tag.
 *         name:
 *           type: string
 *           description: O nome da tag.
 *     ContentWithTags:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID único do conteúdo.
 *         user_id:
 *           type: integer
 *           description: O ID do usuário que criou o conteúdo.
 *         titulo:
 *           type: string
 *           description: O título do conteúdo.
 *         texto:
 *           type: string
 *           description: O corpo do texto do conteúdo.
 *         status:
 *           type: string
 *           description: O status do conteúdo (e.g., 'draft', 'published').
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação do conteúdo.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização do conteúdo.
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *           description: Array de tags associadas ao conteúdo.
 */

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Retorna uma lista de todos os conteúdos com suas tags associadas.
 *     tags: [Contents]
 *     responses:
 *       '200':
 *         description: Uma lista de conteúdos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContentWithTags'
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/', async (req, res) => {
  try {
    // Busca todos os conteúdos, incluindo as tags associadas.
    // 'through: { attributes: [] }' evita que os atributos da tabela de junção (ContentTags) sejam retornados.
    const contents = await Content.findAll({
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }]
    });
    res.json(contents);
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error); // Log detalhado para depuração
    res.status(500).json({ error: error.message || 'Erro interno do servidor ao buscar conteúdos.' });
  }
});

/**
 * @swagger
 * /api/contents/{id}:
 *   get:
 *     summary: Busca um conteúdo específico pelo ID, incluindo suas tags.
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do conteúdo a ser buscado.
 *     responses:
 *       '200':
 *         description: Dados do conteúdo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentWithTags'
 *       '404':
 *         description: Conteúdo não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/:id', async (req, res) => {
  try {
    // Busca um conteúdo pelo ID, incluindo as tags associadas.
    const content = await Content.findByPk(req.params.id, {
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] }
      }]
    });
    if (!content) {
      return res.status(404).json({ message: "Conteúdo não encontrado." });
    }
    res.json(content);
  } catch (error) {
    console.error('Erro ao buscar conteúdo por ID:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor ao buscar conteúdo por ID.' });
  }
});

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Cria um novo conteúdo e associa tags. Requer pelo menos uma tag.
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - titulo
 *               - texto
 *               - tagIds
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: O ID do usuário que está criando o conteúdo.
 *               titulo:
 *                 type: string
 *                 description: O título do novo conteúdo.
 *               texto:
 *                 type: string
 *                 description: O corpo do texto do novo conteúdo.
 *               status:
 *                 type: string
 *                 description: O status inicial do conteúdo (e.g., 'draft').
 *                 default: 'draft'
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *                 description: Array de IDs das tags a serem associadas ao conteúdo. Deve conter pelo menos um ID.
 *     responses:
 *       '201':
 *         description: Conteúdo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentWithTags'
 *       '400':
 *         description: Erro de validação (e.g., tags ausentes ou inválidas).
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/', async (req, res) => {
  // Inicia uma transação para garantir que a criação do conteúdo e a associação das tags sejam atômicas.
  // Se qualquer passo falhar, todas as alterações são revertidas.
  const t = await sequelize.transaction();
  try {
    const { user_id, titulo, texto, status = 'draft', tagIds } = req.body; // Define 'draft' como status padrão

    // Validação de Negócio: Pelo menos uma tag deve ser fornecida.
    if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
      await t.rollback(); // Reverte a transação
      return res.status(400).json({ error: 'Uma nota deve ter pelo menos uma TAG associada.' });
    }

    // 1. Cria o conteúdo na tabela 'Contents'.
    const newContent = await Content.create({ user_id, titulo, texto, status }, { transaction: t });

    // 2. Busca as tags pelos IDs fornecidos para garantir que existam.
    const tags = await Tag.findAll({
      where: { id: tagIds },
      transaction: t
    });

    // Validação: Verifica se todos os IDs de tags fornecidos correspondem a tags existentes.
    if (tags.length !== tagIds.length) {
      await t.rollback(); // Reverte a transação
      return res.status(400).json({ error: 'Um ou mais IDs de TAG fornecidos são inválidos ou não existem.' });
    }

    // 3. Associa as tags encontradas ao novo conteúdo na tabela de junção (ContentTags).
    await newContent.addTags(tags, { transaction: t });

    await t.commit(); // Confirma a transação se todas as operações foram bem-sucedidas.

    // Retorna o conteúdo recém-criado com suas tags para o cliente.
    const createdContentWithTags = await Content.findByPk(newContent.id, {
      include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
    });
    res.status(201).json(createdContentWithTags);

  } catch (error) {
    await t.rollback(); // Reverte a transação em caso de qualquer erro.
    console.error('Erro ao criar conteúdo:', error);
    // Retorna uma mensagem de erro mais específica se disponível, ou uma genérica.
    res.status(400).json({ error: error.message || 'Erro interno do servidor ao criar conteúdo.' });
  }
});

/**
 * @swagger
 * /api/contents/{id}:
 *   put:
 *     summary: Atualiza um conteúdo existente e suas associações de tags.
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do conteúdo a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: O novo título do conteúdo.
 *               texto:
 *                 type: string
 *                 description: O novo corpo do texto do conteúdo.
 *               status:
 *                 type: string
 *                 description: O novo status do conteúdo.
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *                 description: Array de IDs das tags a serem associadas. Se fornecido, substitui as tags existentes. Deve conter pelo menos um ID.
 *     responses:
 *       '200':
 *         description: Conteúdo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentWithTags'
 *       '400':
 *         description: Erro de validação (e.g., tags inválidas).
 *       '404':
 *         description: Conteúdo não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.put('/:id', async (req, res) => {
  const t = await sequelize.transaction(); // Inicia uma transação.
  try {
    const { titulo, texto, status, tagIds } = req.body;
    const contentId = req.params.id;

    // Validação: Se tagIds for fornecido, deve ser um array não vazio.
    if (tagIds !== undefined && (!Array.isArray(tagIds) || tagIds.length === 0)) {
      await t.rollback();
      return res.status(400).json({ error: 'Se fornecido, o campo tagIds deve ser um array com pelo menos um ID de TAG.' });
    }

    // 1. Busca o conteúdo existente.
    const content = await Content.findByPk(contentId, { transaction: t });
    if (!content) {
      await t.rollback();
      return res.status(404).json({ message: 'Conteúdo não encontrado.' });
    }

    // 2. Atualiza os atributos básicos do conteúdo.
    await content.update({ titulo, texto, status }, { transaction: t });

    // 3. Se tagIds foi fornecido, atualiza as associações de tags.
    if (tagIds) {
      const tags = await Tag.findAll({
        where: { id: tagIds },
        transaction: t
      });

      // Validação: Verifica se todos os IDs de tags fornecidos correspondem a tags existentes.
      if (tags.length !== tagIds.length) {
        await t.rollback();
        return res.status(400).json({ error: 'Um ou mais IDs de TAG fornecidos para atualização são inválidos ou não existem.' });
      }
      // 'setTags' remove as associações antigas e adiciona as novas em uma única operação.
      await content.setTags(tags, { transaction: t });
    }

    await t.commit(); // Confirma a transação.

    // Retorna o conteúdo atualizado com suas tags.
    const updatedContentWithTags = await Content.findByPk(contentId, {
      include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
    });
    res.status(200).json(updatedContentWithTags);

  } catch (error) {
    await t.rollback(); // Reverte a transação em caso de erro.
    console.error('Erro ao atualizar conteúdo:', error);
    res.status(400).json({ error: error.message || 'Erro interno do servidor ao atualizar conteúdo.' });
  }
});

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     summary: Deleta um conteúdo específico.
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do conteúdo a ser deletado.
 *     responses:
 *       '204':
 *         description: Conteúdo deletado com sucesso. Nenhuma resposta de corpo.
 *       '404':
 *         description: Conteúdo não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.delete('/:id', async (req, res) => {
  try {
    // 'destroy' retorna o número de linhas afetadas.
    const deleted = await Content.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send(); // Status 204 No Content indica sucesso sem corpo de resposta.
    } else {
      res.status(404).json({ message: 'Conteúdo não encontrado para exclusão.' });
    }
  } catch (error) {
    console.error('Erro ao deletar conteúdo:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor ao deletar conteúdo.' });
  }
});

module.exports = router;