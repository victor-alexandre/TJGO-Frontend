const express = require('express');
const { Content } = require('../models');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contents
 *   description: API para gerenciar conteúdos
 */

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Retorna uma lista de todos os conteúdos
 *     tags: [Contents]
 *     responses:
 *       '200':
 *         description: Uma lista de conteúdos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 */
router.get('/', async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/contents/{id}:
 *   get:
 *     summary: Busca um conteúdo pelo ID
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do conteúdo
 *     responses:
 *       '200':
 *         description: Dados do conteúdo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       '404':
 *         description: Conteúdo não encontrado.
 */
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Conteúdo não encontrado" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Cria um novo conteúdo
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               texto:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Conteúdo criado com sucesso.
 */
router.post('/', async (req, res) => {
  try {
    const { user_id, titulo, texto, status } = req.body;
    const newContent = await Content.create({ user_id, titulo, texto, status });
    res.status(201).json(newContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/contents/{id}:
 *   put:
 *     summary: Atualiza um conteúdo existente
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do conteúdo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               texto:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Conteúdo atualizado com sucesso.
 */
router.put('/:id', async (req, res) => {
  try {
    const { titulo, texto, status } = req.body;
    const [updated] = await Content.update({ titulo, texto, status }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedContent = await Content.findByPk(req.params.id);
      res.status(200).json(updatedContent);
    } else {
      res.status(404).json({ message: 'Conteúdo não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     summary: Deleta um conteúdo
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do conteúdo
 *     responses:
 *       '204':
 *         description: Conteúdo deletado com sucesso.
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Content.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Conteúdo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
