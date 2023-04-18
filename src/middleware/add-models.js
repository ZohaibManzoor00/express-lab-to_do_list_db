const ToDo = require('../db/models/to-do');

const addModels = (req, res, next) => {
  req.ToDo = ToDo;
  next();
};

module.exports = addModels;
