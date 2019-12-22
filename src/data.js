const Data = (() => {
  let data = [];
  const storageId = 'todo_Lists';

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

  const addTodo = () => {
    const inputTitle = document.getElementById('todoTitle').value;
    const inputDescription = document.getElementById('todoDescription').value;
    let inputDueDate = document.getElementById('dueDate').value;
    const inputPriority = document.getElementById('todoPriority').value;
    const inputProject = document.getElementById('todoProject').value.split(' ').join('_');

    if (inputTitle.length === 0 || inputProject.length === 0) {
      const alertBar = document.getElementById('alert-bar');
      alertBar.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Be Careful!</strong> Title and Project must be filled out!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `;
      document.querySelector('.alert');
    } else {
      if (inputDueDate.length === 0) {
        const today = new Date();
        inputDueDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      }

      data.push(todoList(inputTitle,
        inputDescription,
        inputDueDate,
        inputPriority,
        inputProject));

      updateStorage(storageId, data);

      document.getElementById('todoTitle').value = '';
      document.getElementById('todoDescription').value = '';
      document.getElementById('dueDate').value = '';
      document.getElementById('todoPriority').value = '';
      document.getElementById('todoProject').value = '';
    }
  };

  const updateTodo = (todoLists = data, todoId) => {
    for (let i = 0; i < todoLists.length; i += 1) {
      if (todoLists[i].id === todoId) {
        todoLists[i].status = !todoLists[i].status;
      }
    }
    updateStorage(storageId, todoLists);
  }

  const deleteTodo = (todoLists = data, todoId) => {
    for (let i = 0; i < todoLists.length; i += 1) {
      if (todoLists[i].id === todoId) {
        todoLists.splice(i, 1);
      }
    }
    updateStorage(storageId, todoLists);
  }

  const getProjects = (todoLists = data) => {
    const todo = todoLists.map((list) => list.project);
    return [...new Set(todo)];
  }

  const checkBrowserSupport = () => typeof (Storage) !== 'undefined';

  const checkStorage = (id = storageId) => {
    const temp = JSON.parse(window.localStorage.getItem(id));
    if (temp && temp.length !== 0) return true;
    return false;
  }

  const getFromStorage = (id = storageId) => { return JSON.parse(window.localStorage.getItem(id)); }

  const updateStorage = (id = storageId, data) => {
    if (checkBrowserSupport()) {
      window.localStorage.setItem(id, JSON.stringify(data));
    }
  }

  const getData = () => data;

  const init = () => {
    // add demo data;
    data.push(todoList('Buy Food', 'For Next Week', '12/3/2019', 'medium', 'Project1'));
    data.push(todoList('Pay Bill', 'For Next Month', '12/24/2019', 'high', 'Project1'));
    data.push(todoList('Check the gas', 'For Next Month', '12/22/2019', 'high', 'Project1'));
    data.push(todoList('Go to Bank', 'Need to pay the bill', '12/15/2019', 'high', 'Project2'));
    data.push(todoList('Buy some gifts', 'For Christmas', '12/20/2019', 'high', 'Project2'));

    if (checkBrowserSupport()) {
      if (checkStorage()) {
        console.log('have storage');
        data = getFromStorage();
      } else {
        console.log('No Storage');
        updateStorage(storageId, data);
      }

    } else {
      console.log('This Browser Not Support Local Storage!');
    }

    return data;
  }

  return {
    getData,
    addTodo,
    updateTodo,
    deleteTodo,
    getProjects,
    checkStorage,
    getFromStorage,
    updateStorage,
    init,
  };
})();

export default Data;


