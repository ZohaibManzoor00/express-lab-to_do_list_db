const knex = require('./knex');

class ToDo {
  static async create() {}

  static async list() {}

  static async find() {}

  static async updateCompletion() {}

  static async delete() {}

  static async deleteAll() {
    try {
      await knex.raw('TRUNCATE to_dos');
      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = ToDo;
