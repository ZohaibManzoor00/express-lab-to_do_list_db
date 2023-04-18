const list = async (req, res) => {
  const toDos = await req.ToDo.list();
  res.send(toDos);
};

module.exports = list;
