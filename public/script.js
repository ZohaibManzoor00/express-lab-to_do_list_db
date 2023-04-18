// UTILS ///////////////////////////////////////////////////////////////////////
const escapeStr = (htmlStr) => htmlStr.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getOptsWithBody = (body, method = 'POST') => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const handleError = (error) => alert(error.message);

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);
    if (response.status === 204) return [{}];
    return [await response.json()];
  } catch (error) {
    return [null, error];
  }
};

// DOM MANIPULATION ////////////////////////////////////////////////////////////
const getToDoTemplate = (toDoElementId, id, title, isDone) => `
  <input
    type="checkbox"
    ${isDone ? 'checked' : ''}
    id="${toDoElementId}"
    data-to-do-id="${id}"
    class="done-checkbox"
    data-to-do-id="${id}"
  />
  <label id="is-done-label" for="${toDoElementId}" data-to-do-id="${id}" >
    ${escapeStr(title)}
  </label>
  <button
    title="Delete To Do"
    aria-label="Delete To Do"
    type="button"
    class="delete-to-do flex-end"
    data-to-do-id="${id}"
  > X </button>
`;

const renderToDo = ({ id, title, isDone }) => {
  const newListItem = document.createElement('li');
  newListItem.classList.add('card');
  newListItem.innerHTML = getToDoTemplate(`to-do-${id}`, id, title, isDone);
  document.querySelector('#to-do-list').append(newListItem);
};

const createNewToDo = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const title = formData.get('title');
  if (!title) return;

  const postOpts = getOptsWithBody({ title });
  const [toDo, error] = await fetchData('/api/to-dos', postOpts);
  if (error) return handleError(error);

  renderToDo(toDo);
  e.target.reset();
};

// EVENT HANDLERS //////////////////////////////////////////////////////////////
const loadInitialToDos = async () => {
  const [toDos, err] = await fetchData('/api/to-dos');
  if (err) return handleError(err);
  toDos.forEach(renderToDo);
};

const handleDelete = async (target, toDoId) => {
  const [_, err] = await fetchData(`/api/to-dos/${toDoId}`, { method: 'DELETE' });
  if (err) return handleError(err);
  target.parentElement.remove();
};

const handleCheckChange = async (isDone, toDoId) => {
  const opts = getOptsWithBody({ isDone }, 'PATCH');
  const [_, err] = await fetchData(`/api/to-dos/${toDoId}`, opts);
  if (err) return handleError(err);
};

const handleUpdates = async ({ target }) => {
  const { toDoId } = target.dataset;
  if (!toDoId) return;

  if (target.classList.contains('delete-to-do')) {
    handleDelete(target, toDoId);
  } else if (target.classList.contains('done-checkbox')) {
    handleCheckChange(target.checked, toDoId);
  }
};

// MAIN ////////////////////////////////////////////////////////////////////////
const main = () => {
  loadInitialToDos();
  document.querySelector('#add-to-do').addEventListener('submit', createNewToDo);
  document.querySelector('#to-do-list').addEventListener('click', handleUpdates);
};

main();
