const express = require('express');
const { Tag, Content } = require('../models');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: API para gerenciar tags e associá-las a conteúdos
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Retorna uma lista de todas as tags
 *     tags: [Tags]
 *     responses:
 *       '200':
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     summary: Retorna uma tag pelo ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da tag
 *     responses:
 *       '200':
 *         description: Tag encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       '404':
 *         description: Tag não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag não encontrada' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Cria uma nova tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Tag criada com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await Tag.create({ name });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Atualiza uma tag existente
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Tag atualizada com sucesso
 *       '404':
 *         description: Tag não encontrada
 */
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const [updated] = await Tag.update({ name }, { where: { id: req.params.id } });
    if (updated) {
      const updatedTag = await Tag.findByPk(req.params.id);
      res.status(200).json(updatedTag);
    } else {
      res.status(404).json({ message: 'Tag não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Deleta uma tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da tag
 *     responses:
 *       '204':
 *         description: Tag deletada com sucesso
 *       '404':
 *         description: Tag não encontrada
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tag.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Tag não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tags/link:
 *   post:
 *     summary: Associa uma tag a um conteúdo
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content_id:
 *                 type: integer
 *               tag_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Tag associada com sucesso
 */
router.post('/link', async (req, res) => {
  try {
    const { content_id, tag_id } = req.body;
    const content = await Content.findByPk(content_id);
    const tag = await Tag.findByPk(tag_id);

    if (!content || !tag) {
      return res.status(404).json({ message: 'Conteúdo ou Tag não encontrado' });
    }

    await content.addTag(tag);
    res.status(200).json({ message: 'Tag associada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tags/unlink:
 *   delete:
 *     summary: Desassocia uma tag de um conteúdo
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content_id:
 *                 type: integer
 *               tag_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Tag desassociada com sucesso
 */
router.delete('/unlink', async (req, res) => {
  try {
    const { content_id, tag_id } = req.body;
    const content = await Content.findByPk(content_id);
    const tag = await Tag.findByPk(tag_id);

    if (!content || !tag) {
      return res.status(404).json({ message: 'Conteúdo ou Tag não encontrado' });
    }

    await content.removeTag(tag);
    res.status(200).json({ message: 'Tag desassociada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
