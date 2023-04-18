// WHAT'S THIS FILE
// You'll learn more about this later, but a "seed" file is how we can
// pre-populate our database with data. This is useful for testing and
// development purposes.

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('to_dos').del();
  await knex('to_dos').insert([
    { title: 'Go to the store' },
    { title: 'Do the dishes' },
    { title: 'Walk the dog' },
  ]);
};
