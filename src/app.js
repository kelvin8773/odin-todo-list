import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { isAfter, formatDistanceToNow } from 'date-fns'
import './style.css';

let todoLists = [];

// Local Storage
const checkBrowserSupport = () => {
  return typeof (Storage) !== 'undefined';
}

const checkStorage = (id) => {
  const temp = JSON.parse(window.localStorage.getItem(id));
  if (temp && temp.length !== 0) return true;
  return false;
}

const initStorage = (id, data) => {
  if (checkStorage(id)) {
    return getFromStorage(id);
  } else {
    setToStorage(id, data);
    return data;
  }
};

const getFromStorage = (id) => {
  return JSON.parse(window.localStorage.getItem(id));
}

const setToStorage = (id, data) => {
  if (checkBrowserSupport()) {
    window.localStorage.setItem(id, JSON.stringify(data));
  }
}


// Data Module
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

const addTodoList = (todoLists) => {
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

    todoLists.push(todoList(inputTitle,
      inputDescription,
      inputDueDate,
      inputPriority,
      inputProject));

    setToStorage('todoLists', todoLists);

    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('todoPriority').value = '';
    document.getElementById('todoProject').value = '';
  }
};

const getProjectList = (todoLists) => {
  const todo = todoLists.map((list) => list.project);
  const distinctToDos = [...new Set(todo)];
  return distinctToDos;
};

const changeTodo = (todoLists, todoId, action) => {
  if (action === 'delete') {
    for (let i = 0; i < todoLists.length; i += 1) {
      if (todoLists[i].id === todoId) {
        todoLists.splice(i, 1);
      }
    }
  }

  if (action === 'changeStatus') {
    for (let i = 0; i < todoLists.length; i += 1) {
      if (todoLists[i].id === todoId) {
        todoLists[i].status = !todoLists[i].status;
      }
    }
  }

  return todoLists;
};

// UI
const renderTodoList = (lists, node) => {
  node.innerHTML = '';

  for (let i = 0; i < lists.length; i += 1) {
    const listLine = document.createElement('tr');
    if (lists[i].status) {
      listLine.setAttribute('class', 'text-danger cross-text');
    }

    const listID = document.createElement('th');
    listID.scope = 'row';
    listID.innerText = i;
    listLine.append(listID);

    const listTitle = document.createElement('td');
    listTitle.innerText = lists[i].title;
    listLine.append(listTitle);

    const listDescription = document.createElement('td');

    listDescription.innerText = lists[i].description;
    listLine.append(listDescription);

    const listDueDate = document.createElement('td');
    const dueDate = new Date(lists[i].dueDate);
    const daysDiff = formatDistanceToNow(dueDate);
    if (isAfter(dueDate, new Date())) {
      listDueDate.innerText = `${daysDiff} to go`;
    } else {
      listDueDate.innerText = `${daysDiff} pass due`;
    }
    listLine.append(listDueDate);

    const listPriority = document.createElement('td');
    listPriority.innerText = lists[i].priority;
    listLine.append(listPriority);

    const listStatus = document.createElement('td');
    if (lists[i].status) {
      listStatus.innerHTML = `
      <label class="switch">
        <input type="checkbox" checked>
        <span class="slider round"></span>
      </label>`;
    } else {
      listStatus.innerHTML = `
      <label class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
      </label>`;
    }

    listStatus.addEventListener('change', () => {
      renderTodoListTabs(changeTodo(todoLists, lists[i].id, 'changeStatus'));
    });
    listLine.append(listStatus);

    const listDelete = document.createElement('td');
    listDelete.setAttribute('class', 'text-secondary delete-todo');
    listDelete.innerHTML = '<i class="fas fa-trash-alt fa-lg ml-3"></i>';
    listDelete.addEventListener('click', () => {
      renderTodoListTabs(changeTodo(todoLists, lists[i].id, 'delete'));
    });
    listLine.append(listDelete);

    node.append(listLine);
  }

  return node;
};

const renderProjectListForm = (projectLists) => {
  const addListForm = document.getElementById('add-list-form');
  const projectDatalist = document.getElementById('project-Lists');
  projectDatalist.innerHTML = '';

  for (let i = 0; i < projectLists.length; i += 1) {
    const projectListOption = document.createElement('option');
    projectListOption.value = projectLists[i];
    projectDatalist.append(projectListOption);
  }
  addListForm.append(projectDatalist);
};

const renderProjectTabs = (projectLists) => {
  const projectTabs = document.getElementById('project-tabs');
  projectTabs.innerHTML = '';

  for (let i = 0; i < projectLists.length; i += 1) {
    const projectTab = document.createElement('a');
    if (i === 0) {
      projectTab.setAttribute('class', 'nav-item nav-link active');
      projectTab.setAttribute('aria-selected', 'true');
    } else {
      projectTab.setAttribute('class', 'nav-item nav-link');
      projectTab.setAttribute('aria-selected', 'false');
    }

    projectTab.setAttribute('id', `${projectLists[i]}-tab`);
    projectTab.setAttribute('data-toggle', 'tab');
    projectTab.setAttribute('href', `#${projectLists[i]}`);
    projectTab.setAttribute('role', 'tab');
    projectTab.setAttribute('aria-controls', projectLists[i]);
    projectTab.innerText = projectLists[i];
    projectTabs.append(projectTab);
  }
};

const renderTodoListTabs = (todoLists) => {
  const projectLists = getProjectList(todoLists);
  const tabContent = document.getElementById('nav-tabContent');
  tabContent.innerHTML = '';

  for (let i = 0; i < projectLists.length; i += 1) {
    const tabPanel = document.createElement('div');
    if (i === 0) {
      tabPanel.setAttribute('class', 'tab-pane fade show active');
    } else {
      tabPanel.setAttribute('class', 'tab-pane fade');
    }
    tabPanel.setAttribute('id', projectLists[i]);
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', `${projectLists[i]}-tab`);

    const todoListTable = document.createElement('table');
    todoListTable.setAttribute('class', 'table table-hover');
    todoListTable.setAttribute('cellspacing', '0');
    todoListTable.insertAdjacentHTML('afterbegin',
      `<thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Description</th>
        <th scope="col">DueDate</th>
        <th scope="col">Priority</th>
        <th scope="col">Status</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>`);
    const todoListBody = document.createElement('tbody');
    const projectTodoLists = todoLists.filter((todo) => todo.project === projectLists[i]);

    todoListTable.append(renderTodoList(projectTodoLists, todoListBody));
    tabPanel.append(todoListTable);
    tabContent.append(tabPanel);
  }
};

const render = (todoLists) => {
  const projectLists = getProjectList(todoLists);

  if (projectLists.length !== 0) renderProjectTabs(projectLists);
  if (todoList.length !== 0) renderTodoListTabs(todoLists);

  renderProjectListForm(projectLists);
};

// app logic
const Controller = (() => {

  const runApp = () => {
    addTodoList(todoLists);
    render(todoLists);
  };

  const init = () => {
    todoLists.push(todoList('Buy Food', 'For Next Week', '12/3/2019', 'medium', 'Project1'));
    todoLists.push(todoList('Pay Bill', 'For Next Month', '12/24/2019', 'high', 'Project1'));
    todoLists.push(todoList('Check the gas', 'For Next Month', '12/22/2019', 'high', 'Project1'));
    todoLists.push(todoList('Go to Bank', 'Need to pay the bill', '12/15/2019', 'high', 'Project2'));
    todoLists.push(todoList('Buy some gifts', 'For Christmas', '12/20/2019', 'high', 'Project2'));

    todoLists = initStorage('todoLists', todoLists);

    render(todoLists);
    const addListButton = document.getElementById('add-list-button');
    addListButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
