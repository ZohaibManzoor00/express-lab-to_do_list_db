const create = async (req, res) => {
  const { ToDo, body: { title } } = req;
  const newTask = await ToDo.create(title);
  newTask
    ? res.status(201).send(newTask)
    : res.status(500).send({ err: "Can't create" });
};

module.exports = create;
