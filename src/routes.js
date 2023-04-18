const express = require('express');
const toDoController = require('./controllers/to-do');
const addModels = require('./middleware/add-models');

const router = express.Router();

router.use(addModels);

router.post('/api/to-dos', toDoController.create); // CREATE
router.get('/api/to-dos', toDoController.list); // READ ALL
router.get('/api/to-dos/:id', toDoController.show); // READ ONE
router.patch('/api/to-dos/:id', toDoController.update); // UPDATE
router.delete('/api/to-dos/:id', toDoController.destroy); // DELETE ONE
router.delete('/api/to-dos', toDoController.destroyAll); // DELETE ALL

module.exports = router;
