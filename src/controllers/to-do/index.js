/**
 * What's this file?
 *
 * This is called a "Barrel file" and it will let us import and export
 * all of our handlers into one file so our routes file can grab them all at once.
 *
 * There are pros and cons to them but you should be aware of the pattern.
 *
 */
const create = require('./create');
const list = require('./list');
const show = require('./show');
const update = require('./update');
const destroy = require('./destroy');
const destroyAll = require('./destroy-all');

module.exports = {
  create,
  list,
  show,
  update,
  destroy,
  destroyAll,
};
