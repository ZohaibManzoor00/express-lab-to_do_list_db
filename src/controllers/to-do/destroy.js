const destroy = async (req, res) => {
  const { ToDo, params: { id } } = req;
  const result = await ToDo.delete(Number(id));
  res.sendStatus(result ? 204 : 404);
};

module.exports = destroy;
