const show = async (req, res) => {
  const { ToDo, params: { id } } = req;
  const task = await ToDo.find(Number(id));
  if (!task) return res.sendStatus(404);
  res.send(task);
};

module.exports = show;
