import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { isAfter, formatDistanceToNow } from 'date-fns';
import Data from './data';
import './style.css';

let todoLists = [];

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
      Data.updateTodo(todoLists, lists[i].id);
      renderTodoListTabs(Data.getData());
    });
    listLine.append(listStatus);

    const listDelete = document.createElement('td');
    listDelete.setAttribute('class', 'text-secondary delete-todo');
    listDelete.innerHTML = '<i class="fas fa-trash-alt fa-lg ml-3"></i>';
    listDelete.addEventListener('click', () => {
      Data.deleteTodo(todoLists, lists[i].id);
      renderTodoListTabs(Data.getData());
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
  const projects = Data.getProjects();
  const tabContent = document.getElementById('nav-tabContent');
  tabContent.innerHTML = '';

  for (let i = 0; i < projects.length; i += 1) {
    const tabPanel = document.createElement('div');
    if (i === 0) {
      tabPanel.setAttribute('class', 'tab-pane fade show active');
    } else {
      tabPanel.setAttribute('class', 'tab-pane fade');
    }
    tabPanel.setAttribute('id', projects[i]);
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', `${projects[i]}-tab`);

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
    const projectTodoLists = todoLists.filter((todo) => todo.project === projects[i]);

    todoListTable.append(renderTodoList(projectTodoLists, todoListBody));
    tabPanel.append(todoListTable);
    tabContent.append(tabPanel);
  }
};

const render = (todoLists) => {
  const projects = Data.getProjects();

  if (projects.length !== 0) renderProjectTabs(projects);
  if (todoLists.length !== 0) renderTodoListTabs(todoLists);

  renderProjectListForm(projects);
};

// app logic
const Controller = (() => {
  const runApp = () => {
    Data.addTodo();
    todoLists = Data.getData();
    render(todoLists);
  };

  const init = () => {
    todoLists = Data.init();
    render(todoLists);
    const addListButton = document.getElementById('add-list-button');
    addListButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
