const Data = (() => {
  let data = [];
  const storageId = 'todo_Lists';

  const checkBrowserSupport = () => typeof (Storage) !== 'undefined';

  const checkStorage = (id = storageId) => {
    const temp = JSON.parse(window.localStorage.getItem(id));
    if (temp && temp.length !== 0) return true;
    return false;
  };

  const getFromStorage = (id = storageId) => JSON.parse(window.localStorage.getItem(id));

  const updateStorage = (id = storageId, data) => {
    if (checkBrowserSupport()) {
      window.localStorage.setItem(id, JSON.stringify(data));
    }
  };

  const getTodo = () => data;

  const todoList = (title, description, dueDate, priority, project) => {
    const status = false;
    const id = `_${Math.random().toString(36).substr(2, 12)}`;

    return {
      id,
      title,
      description,
      dueDate,
      priority,
      status,
      project,
    };
  };

  const addTodo = (todo) => {
    const t = todoList(todo.title, todo.description, todo.dueDate, todo.priority, todo.project);
    data.push(t);
    updateStorage(storageId, data);
    return data;
  };

  const updateTodo = (todo) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === todo.id) {
        data[i].title = todo.title;
        data[i].description = todo.description;
        data[i].dueDate = todo.dueDate;
        data[i].priority = todo.priority;
        data[i].project = todo.project;
        data[i].status = todo.status;
      }
    }

    updateStorage(storageId, data);
    return data;
  };

  const deleteTodo = (todoId) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === todoId) {
        data.splice(i, 1);
      }
    }
    updateStorage(storageId, data);
    return data;
  };

  const getProjects = () => {
    const todoLists = getTodo();
    const todo = todoLists.map(list => list.project);
    return [...new Set(todo)];
  };

  const init = () => {
    data.push(todoList('Buy Food', 'For Next Week', '12/3/2019', 'medium', 'Project1'));
    data.push(todoList('Pay Bill', 'For Next Month', '12/24/2019', 'high', 'Project1'));
    data.push(todoList('Check the gas', 'For Next Month', '12/22/2019', 'high', 'Project1'));
    data.push(todoList('Go to Bank', 'Need to pay the bill', '12/15/2019', 'high', 'Project2'));
    data.push(todoList('Buy some gifts', 'For Christmas', '12/20/2019', 'high', 'Project2'));

    if (checkBrowserSupport()) {
      if (checkStorage()) {
        data = getFromStorage();
      } else {
        updateStorage(storageId, data);
      }
    }

    return data;
  };

  return {
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    getProjects,
    init,
  };
})();

export default Data;
