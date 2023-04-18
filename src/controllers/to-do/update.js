const update = async (req, res) => {
  const {
    ToDo,
    params: { id },
    body: { isDone },
  } = req;
  const task = await ToDo.updateCompletion(Number(id), isDone);
  if (!task) return res.sendStatus(404);
  res.send(task);
};

module.exports = update;
