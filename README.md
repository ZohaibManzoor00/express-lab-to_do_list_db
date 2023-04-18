# To Do List DB Version

- [To Do List DB Version](#to-do-list-db-version)
  - [Starter Code](#starter-code)
  - [Project Goals](#project-goals)
- [Before You Start](#before-you-start)
  - [.env file and variables](#env-file-and-variables)
  - [Migrations and Seeds](#migrations-and-seeds)
- [Testing](#testing)
- [Question 1: create()](#question-1-create)
- [Question 2: list()](#question-2-list)
- [Question 3: find()](#question-3-find)
- [Question 4: updateCompletion()](#question-4-updatecompletion)
- [Question 5: delete()](#question-5-delete)
- [Bonus: Use Knex Query Functions](#bonus-use-knex-query-functions)
- [SUPER Bonus: The One True PATCH](#super-bonus-the-one-true-patch)


You are going to make a To Do List list app using the CRUD actions. Seem familiar? The difference this time is that we're going to *start* with the Express side already completed and instead focus on the model.

## Starter Code
We have provided the following for you:
- A full test suite covering all required actions
- A full set of Express routes that call the model methods
- A front end where you can visually test your actions
- Migrations to create the DB tables
- Seeds to populate the DB

## Project Goals
  > - Understand how to use CRUD action in a realistic app using a DB
  > - Use `knex.raw` to build your queries to understand the underlying SQL

The only file you need to edit is the model file, [db/models/to-do.js](./src/db/models/to-do.js).

# Before You Start
Because we have a DB now, we need to make sure that it's set up properly.

## .env file and variables
In order to connect, we're relying on environment variables. Copy `.env.template` as a new `.env` file. There are already default values set, but change them if you need to. For example, if you've created a different database for this assignment, change the name from the default `postgres`.


## Migrations and Seeds
Run the following command:

```bash
npm run kickstart # installs, migrates, and seeds
```

This will ensure that the migrations and seed files run. Remember, the migrations create the table architecture, and the seed file creates some starter data. If you want to run them individually, those commands have also been saved to the `package.json`.

You only have to run `npm start` after that if you ever restart your server. We're using nodemon again, so the server will auto-restart on file saves.

# Testing
Be sure to run your test suite (`npm run test:w` for continuous testing, `npm test` to run once), but there's a catch! We're testing the *server* not the model. That means you have to pay careful attention to how these methods are actually used in the application to see what each method's input and output should be.

We're trying to mimic a common job situation. You will often be asked to modify things like models without guiding tests. However, you *will* have existing tests that you can't break. Now, on the job, you would then write model tests for the new features, but we aren't asking that (...*yet*).

**Focus on the code that is already written, and extend your methods from there.**

_**DO NOT EDIT THE SERVER CODE**_

As usual, we've provided the `deleteAll` model method since we need it for our tests. Perhaps you can use this as a template for your new methods?

# Question 1: create()
Create a new to do. What will you get as input, and what will you expect the return value to be?

**Used in:** `src/controllers/to-do/create.js`

*hint:* Remember, `UPDATE` and `INSERT` queries don't return the new/edited db rows by default, so be sure to include `RETURNING *` at the end of the query.


# Question 2: list()
Get a list of `to dos`. Is there any error handling in the `list` route? No? So then it seems like this method should always return some data type, *even if there's an error*. What might be a good default return value for a method called `list`?

**Used in:** `src/controllers/to-do/list.js`

# Question 3: find()
Given a *very specific identifying piece of data*, return a `to do`. If no `to do` is found (or there's an error), what should you return?

*Knex hint*: Check your practice SQL assignment if you forgot how to pass in `dynamic parameters` into `knex.raw` queries. (Or, check the [docs](https://knexjs.org/guide/raw.html))

**Used in:** `src/controllers/to-do/show.js`

# Question 4: updateCompletion()
This method will update a specific `to do's` completion status. Either `true` to `false` or vice versa, make sure both work! If no `to do` is found (or there's an error) what should it return instead?

**Used in:** `src/controllers/to-do/update.js`

# Question 5: delete()
Delete a specific `to do`. If there is no `to do` to delete (or an error), what kind of value is the route expecting you to return from this method?

**Used in:** `src/controllers/to-do/destroy.js`


# Bonus: Use Knex Query Functions
We're using `knex.raw` on purpose to teach you SQL (which, is a more useful skill than knex syntax). But, as you may have guessed, knex isn't just for raw sql. So if you're looking for a challenge, **comment out all the code you have written so far, and rewrite it using knex query functions.**

**Make sure all tests still pass!!!!!** We don't want you to be penalized. Make sure to commit your passing code before attempting this. Then, before final submission, double check that all tests still pass before pushing up your code. We recommend changing one route at a time so it's easier to ensure tests maintain completion.

You can find information on the queries you'll need in the [knex query docs](https://knexjs.org/guide/query-builder.html). Here's an example using the `deleteAll` method:

```js

  static async deleteAll() {
    // try {
    //   await knex.raw('TRUNCATE to_dos');
    //   return true;
    // } catch (err) {
    //   console.error(err);
    //   return null;
    // }

    try {
      await knex('to_dos').truncate();
      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
```
Commenting out the entire previous version will make it easier for your teachers to see both versions, so please do it that way.

# SUPER Bonus: The One True PATCH
Here's a little secret: our `PATCH` route is a lie. All it can ever do is update the completion status. But what if we wanted to update the title? To fix this, create a new class method called `update`.

- `update` will take in an id, and an object with a `title` and/or `is_done` property.
- The method should update the corresponding `to do` in the DB, and then return the updated `to do`.
- If no `to do` was found (or there was an error), return `null`.
- You should try this with both `knex.raw` and knex queries. See which is easier!

Finally, swap this method into your update controller, and modify any parameters you need to (yes, you have permission to edit just this bit of the server). The existing tests should still pass, but you can use Postman to send new server requests to check if the new `title` property also gets updated.
