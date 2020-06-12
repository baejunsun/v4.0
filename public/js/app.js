// import { ajax } from './ajax.js';
import { ajax } from './xhr.js';
let todos = [];
let navState = 'all';

const request = {
  get(url) {
    return fetch(url);
  },
  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  delete(url) {
    return fetch(url, { method: 'DELETE' });
  }
};

// DOMs
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all > .checkbox');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $nav = document.querySelector('.nav');

const render = () => {

  let html = '';

  const _todos = todos.filter(({ completed }) => (navState === 'completed' ? completed : navState === 'active' ? !completed : true));

  _todos.forEach(todo => {
    
    html += `<li id="${todo.id}" class="todo-item">
        <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}>
        <label for="ck-${todo.id}">${todo.content}</label>
        <i class="remove-todo far fa-times-circle"></i>
      </li>`;
  });

  $todos.innerHTML = html;
  $completedTodos.textContent = todos.filter(({ completed }) => completed).length;
  $activeTodos.textContent = todos.filter(({ completed }) => !completed).length;
};

const getTodos = () => {
  request.get('/todos')
  .then(response => response.json(response))
  .then(_todos => todos = _todos)
  .then(console.log)
  .then(render)
  .catch(err => console.error(err));
  // ajax.get('/todos')
  //   .then(_todos => todos = _todos)
  //   .then(console.log)
  //   .then(render)
  //   .catch(err => console.error(err));

  // navState = 'all';
  // ajax.get('/todos', _todos => { todos = _todos});
  // todos.sort((todo1, todo2) => todo2.id - todo1.id);
  // render();
};

const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

const addTodo = content => {
  let newTodo = { id : generateId(), content, completed: false};

  request.post('/todos', newTodo)
    .then(response => response.json(response))
    .then(_todos => todos = _todos)
    .then(console.log(render()))
    .catch(err => console.error(err));

  // ajax.post('/todos', newTodo)
  //   .then(_todos => todos = _todos)
  //   .then(render)
  //   .catch(err => console.error(err));
  // 2)
  // ajax.post('/todos', newTodo, _todos => {
  //   todos = _todos;
  //   render();
  // });

  // 1)
  // todos = [{ id: generateId(), content, completed: false }, ...todos];
  // console.log('[addTodo]', todos);
  // console.log(newTodo);
  
};

const toggleTodo = id => {
  request.patch(`/todos/${+id}`, { completed})
  .then(response => response.json(response))
  .then(_todos => todos = todos.map(todo => todo.id === +id ? { ...todo, completed: !todo.completed } : todo))
  .then(render)
  .catch(err => console.error(err));

  // ajax.patch(`/todos/${+id}`, { completed })
  //   .then(_todos => todos = todos.map(todo => todo.id === +id ? { ...todo, completed: !todo.completed } : todo))
  //   .then(render)
  //   .catch(err => console.error(err));

  // ajax.patch(`/todos/${+id}`, { completed }, _todos => {
  //   todos = todos.map(todo => todo.id === +id ? { ...todo, completed: !todo.completed } : todo);
  //   render();
  // });

  // todos = todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo));
  // console.log('[toggleTodo]', todos);
  
};

const removeTodo = id => {
  request.delete(`/todos/${+id}`)
  .then(response => response.json(response))
  .then(_todos => todos = _todos)
  .then(render)
  .catch(err => console.error(err));

  // ajax.delete(`/todos/${+id}`)
  //   .then(_todos => todos = _todos)
  //   .then(render)
  //   .catch(err => console.error(err));

  // ajax.delete(`/todos/${+id}`, _ => {
  //   todos = todos.filter(todo => todo.id !== +id);
  //   render();
  // });

  // todos = todos.filter(todo => todo.id !== +id);
  // console.log('[removeTodo]', todos);
  
};

const toggleCompleteAll = completed => {
  request.patch('/todos', {completed})
  .then(response => response.json(response))
  .then(_todos => todos = _todos)
  .then(render)
  .catch(err => console.error(err));
  // ajax.patch('/todos', {completed})
  //   .then(_todos => todos = _todos )
  //   .then(render)
  //   .catch(err => console.error(err));

  // ajax.patch('/todos', { completed } , todo => {
  //   todos = todo;
  //   render();
  // });

  // todos = todos.map(todo => ({ ...todo, completed }));
  // console.log('[toggleCompleteAll]', todos);
   
  
};

const removeCompleted = () => {
  
  todos.forEach(todo => {
    request.delete(`/todos/${todo.id}`)
    .then(response => response.json(response))
    .then(todos = todos.filter(todo => !todo.completed))
    .then(render)
    .catch(err => console.error(err));
    
    // ajax.delete(`/todos/${todo.id}`)
    //   .then(todos = todos.filter(todo => !todo.completed))
    //   .then(render)
    //   .catch(err => console.error(err));

    // ajax.delete(`/todos/${todo.id}`, todos = todos.filter(todo => !todo.completed))
    // render();
  });
  // todos = todos.filter(todo => !todo.completed);
  // console.log('[removeCompleted]', todos);

  
};

const changeNavState = id => {
  [...$nav.children].forEach($navItem => {
    $navItem.classList.toggle('active', $navItem.id === id);
  });
  navState = id;

  console.log('[changeNavState]', navState);
  render();
};

// Event bindings
window.onload = () => getTodos()

$inputTodo.onkeyup = ({ keyCode, target }) => {
  const content = target.value.trim();
  if (keyCode !== 13 || content === '') return;
  addTodo(content);
  target.value = '';
};

$todos.onchange = e => {
  toggleTodo(e.target.parentNode.id);
};

$todos.onclick = e => {
  if (!e.target.matches('.todos > li > .remove-todo')) return;
  removeTodo(e.target.parentNode.id);
};

$completeAll.onchange = e => {
  toggleCompleteAll(e.target.checked);
};

$clearCompleted.onclick = removeCompleted;

$nav.onclick = ({ target }) => {
  if (!target.matches('.nav > li:not(.active)')) return;
  changeNavState(target.id);
};
