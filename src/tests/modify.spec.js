const request = require('supertest');
const path = require('path');
const ScoreCounter = require('score-tests');
const app = require('../server');
const knex = require('../db/models/knex');

const testSuiteName = 'From Scratch Tests';
const scoresDir = path.join(__dirname, '..', '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

describe(testSuiteName, () => {
  afterEach(async () => request(app).delete('/api/to-dos'));

  it('GET /api/to-dos sees all "to dos"', async () => {
    const toDoTitle1 = 'Create the first "to do"';
    const toDoTitle2 = 'Create the second "to do"';
    await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle1 })
      .set('Accept', 'application/json');

    await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle2 })
      .set('Accept', 'application/json');

    const res = await request(app).get('/api/to-dos');

    const [toDo1, toDo2] = res.body;

    expect(res.status).toEqual(200);
    expect(toDo1.id).toBeGreaterThan(0);
    expect(toDo1.title).toBe(toDoTitle1);
    expect(toDo1.is_done).toBe(false);
    expect(toDo2.id).toBeGreaterThan(0);
    expect(toDo2.title).toBe(toDoTitle2);
    expect(toDo2.is_done).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('GET /api/to-dos serves empty array if no "to dos"', async () => {
    const res = await request(app).get('/api/to-dos');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual([]);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('GET /api/to-dos/:id sees a single "to dos"', async () => {
    const toDoTitle1 = 'Create the first "to do"';
    const newToDo = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle1 })
      .set('Accept', 'application/json');

    const res = await request(app).get(`/api/to-dos/${newToDo.body.id}`);

    const { id, title, is_done: isDone } = res.body;

    expect(id).toBeGreaterThan(0);
    expect(title).toBe(toDoTitle1);
    expect(isDone).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('GET /api/to-dos/:id 404s if there is no "to do"', async () => {
    const res = await request(app).get(`/api/to-dos/121232`);

    expect(res.status).toEqual(404);
    expect(res.text).toEqual('Not Found');

    // This chunk is repeated to make sure the default Express value auto pass test
    // This is because this is HW, in real life you don't repeat tests for no reason.
    const toDoTitle1 = 'Create the first "to do"';
    const newToDo = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle1 })
      .set('Accept', 'application/json');

    const res2 = await request(app).get(`/api/to-dos/${newToDo.body.id}`);

    const { id, title, is_done: isDone } = res2.body;

    expect(id).toBeGreaterThan(0);
    expect(title).toBe(toDoTitle1);
    expect(isDone).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('POST /api/to-dos creates a "to do"', async () => {
    const toDoTitle = 'Create a "to do"';
    const res = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
    const { id, title, is_done: isDone } = res.body;
    expect(id).toBeGreaterThan(0);
    expect(title).toBe(toDoTitle);
    expect(isDone).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('PATCH /api/to-dos/:id updates a "to do"', async () => {
    const toDoTitle = 'Go to the store';
    const createRes = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle })
      .set('Accept', 'application/json');

    const { id } = createRes.body;

    const updateRes1 = await request(app)
      .patch(`/api/to-dos/${id}`)
      .send({ isDone: true });

    expect(updateRes1.status).toEqual(200);
    expect(updateRes1.body.id).toBe(id);
    expect(updateRes1.body.title).toBe(toDoTitle);
    expect(updateRes1.body.is_done).toBe(true);

    const updateRes2 = await request(app)
      .patch(`/api/to-dos/${id}`)
      .send({ isDone: false });

    expect(updateRes2.status).toEqual(200);
    expect(updateRes2.body.id).toBe(id);
    expect(updateRes2.body.title).toBe(toDoTitle);
    expect(updateRes2.body.is_done).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('PATCH /api/to-dos/:id returns 404 if a "to do" does not exist', async () => {
    const updateRes = await request(app)
      .patch('/api/to-dos/100')
      .send({ isDone: true });

    expect(updateRes.status).toEqual(404);
    expect(updateRes.text).toEqual('Not Found');

    // Why is this repeated? In real life it wouldn't be, but this is HW.
    // Express automatically send 404s for non-existent routes,
    // so this is to make sure the test doesn't pass by default.
    // We only want 404s on ids that don't exist.
    const toDoTitle = 'Go to the store';
    const createRes = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle })
      .set('Accept', 'application/json');

    const { id } = createRes.body;

    const updateRes1 = await request(app)
      .patch(`/api/to-dos/${id}`)
      .send({ isDone: true });

    expect(updateRes1.status).toEqual(200);
    expect(updateRes1.body.id).toBe(id);
    expect(updateRes1.body.title).toBe(toDoTitle);
    expect(updateRes1.body.is_done).toBe(true);

    const updateRes2 = await request(app)
      .patch(`/api/to-dos/${id}`)
      .send({ isDone: false });

    expect(updateRes2.status).toEqual(200);
    expect(updateRes2.body.id).toBe(id);
    expect(updateRes2.body.title).toBe(toDoTitle);
    expect(updateRes2.body.is_done).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('DELETE /api/to-dos/:id deletes an existing "to do"', async () => {
    const toDoTitle = 'Go to the store';
    const createRes = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle })
      .set('Accept', 'application/json');

    const { id } = createRes.body;
    const deleteRes = await request(app).delete(`/api/to-dos/${id}`);

    expect(deleteRes.status).toEqual(204);
    expect(deleteRes.body).toEqual({});
    expect(deleteRes.text).toEqual('');

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('DELETE /api/to-dos/:id returns 404 if a "to do" does not exist', async () => {
    const deleteRes = await request(app)
      .delete('/api/to-dos/100');

    expect(deleteRes.status).toEqual(404);
    expect(deleteRes.text).toEqual('Not Found');

    // Why is this repeated? In real life it wouldn't be, but this is HW.
    // Express automatically send 404s for non-existent routes,
    // so this is to make sure the test doesn't pass by default.
    // We only want 404s on ids that don't exist.
    const toDoTitle = 'Go to the store';
    const createRes = await request(app)
      .post('/api/to-dos')
      .send({ title: toDoTitle })
      .set('Accept', 'application/json');

    const { id } = createRes.body;
    const deleteRes2 = await request(app).delete(`/api/to-dos/${id}`);

    expect(deleteRes2.status).toEqual(204);
    expect(deleteRes2.body).toEqual({});
    expect(deleteRes2.text).toEqual('');

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  // IGNORE PLEASE
  beforeEach(() => scoreCounter.add(expect));
  afterAll(async () => {
    await knex.destroy();
    scoreCounter.export();
  });
});
