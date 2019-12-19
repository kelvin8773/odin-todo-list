import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './style.css';

const todoLists = [];

// UI 
const render = (todoLists) => {
  let projectLists = getProjectList(todoLists);
  if (projectLists.length !== 0) renderProjectTabs(projectLists);
  if (todoList.length !== 0) renderTodoListTabs(todoLists);

  renderProjectListForm(projectLists);

}

const renderProjectTabs = (projectLists) => {
  let projectTabs = document.getElementById('project-tabs');
  projectTabs.innerHTML = '';

  for (let project of projectLists) {
    let projectTab = document.createElement('a');
    if (projectLists.indexOf(project) === 0) {
      projectTab.setAttribute('class', "nav-item nav-link active");
      projectTab.setAttribute('aria-selected', "true");
    } else {
      projectTab.setAttribute('class', "nav-item nav-link");
      projectTab.setAttribute('aria-selected', "false");
    }

    projectTab.setAttribute('id', project + "-tab");
    projectTab.setAttribute('data-toggle', "tab");
    projectTab.setAttribute('href', "#" + project);
    projectTab.setAttribute('role', "tab");
    projectTab.setAttribute('aria-controls', project);
    projectTab.innerText = project;
    projectTabs.append(projectTab);
  }
}

const renderTodoListTabs = (todoLists) => {
  const projectLists = getProjectList(todoLists);
  const tabContent = document.getElementById('nav-tabContent');
  tabContent.innerHTML = '';

  for (let project of projectLists) {
    const tabPanel = document.createElement('div');
    if (projectLists.indexOf(project) === 0) {
      tabPanel.setAttribute('class', "tab-pane fade show active");
    } else {
      tabPanel.setAttribute('class', "tab-pane fade");
    }
    tabPanel.setAttribute('id', project);
    tabPanel.setAttribute('role', "tabpanel");
    tabPanel.setAttribute('aria-labelledby', project + "-tab");

    const todoListTable = document.createElement('table');
    todoListTable.setAttribute('class', "table table-hover");
    todoListTable.setAttribute('cellspacing', "0");
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
    const projectTodoLists = todoLists.filter((todo) => todo.project === project);

    todoListTable.append(renderTodoList(projectTodoLists, todoListBody));
    tabPanel.append(todoListTable);
    tabContent.append(tabPanel);
  }
};

const renderTodoList = (lists, node) => {
  node.innerHTML = ''
  for (let i = 0; i < lists.length; i += 1) {

    const listLine = document.createElement('tr');
    if (lists[i].status) {
      listLine.setAttribute('class', "text-danger cross-text");
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
    listDueDate.innerText = lists[i].dueDate;
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

    };

    listStatus.addEventListener('change', function () {
      renderTodoListTabs(changeTodo(todoLists, lists[i].id, 'changeStatus'))
    });
    listLine.append(listStatus);

    const listDelete = document.createElement('td');
    listDelete.setAttribute('class', "text-secondary delete-todo");
    listDelete.innerHTML = '<i class="fas fa-trash-alt fa-lg"></i>';
    listDelete.addEventListener('click', function () {
      renderTodoListTabs(changeTodo(todoLists, lists[i].id, 'delete'));
    })
    listLine.append(listDelete);

    node.append(listLine);
  }

  return node
}

const renderProjectListForm = (projectLists) => {
  let addListForm = document.getElementById('add-list-form');
  let projectDatalist = document.getElementById('project-Lists');
  projectDatalist.innerHTML = '';

  for (let projectList of projectLists) {
    let projectListOption = document.createElement('option');
    projectListOption.value = projectList;
    projectDatalist.append(projectListOption);
  }
  addListForm.append(projectDatalist);
}

// Data Module 
const todoList = (title, description, dueDate, priority, project) => {
  let status = false;
  let id = '_' + Math.random().toString(36).substr(2, 12);

  return {
    id,
    title,
    description,
    dueDate,
    priority,
    status,
    project
  };
};

const addTodoList = (todoLists) => {
  const inputTitle = document.querySelector('#todoTitle').value;
  const inputDescription = document.querySelector('#todoDescription').value;
  let inputDueDate = document.querySelector('#dueDate').value;
  const inputPriority = document.querySelector('#todoPriority').value;
  const inputProject = document.getElementById('todoProject').value;

  if (inputTitle.length === 0 || inputProject.length === 0) {
    alert("Title and Project must be filled out");
  } else {
    if (inputDueDate.length === 0) {
      let today = new Date();
      inputDueDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    }
    todoLists.push(todoList(inputTitle, inputDescription, inputDueDate, inputPriority, inputProject));
  }
};

const getProjectList = (todoLists) => {
  const todo = todoLists.map((list) => list.project);
  const distinctToDos = [...new Set(todo)];
  return distinctToDos;

}

const changeTodo = (todoLists, todoId, action) => {
  console.log(todoId);
  if (action === 'delete') {
    for (let i = 0; i < todoLists.length; i++) {
      if (todoLists[i].id === todoId) {
        todoLists.splice(i, 1);
      }
    }
  };

  console.log(todoLists, todoId, action);

  if (action === 'changeStatus') {
    for (let i = 0; i < todoLists.length; i++) {
      if (todoLists[i].id === todoId) {
        todoLists[i].status = !todoLists[i].status;
      }
    }
  };

  return todoLists;
};

// app logic 
const Controller = (() => {
  const setupApp = () => {
    render(todoLists);
  }

  const runApp = () => {
    addTodoList(todoLists);
    setupApp();
  };

  const init = () => {
    // Add sample todo lists
    todoLists.push(todoList('Buy Food', 'For Next Week', '12/3/2019', 'medium', 'Project1'));
    todoLists.push(todoList('Pay Bill', 'For Next Month', '12/24/2019', 'high', 'Project1'));
    todoLists.push(todoList('check the gas', 'For Next Month', '12/22/2019', 'high', 'Project1'));
    todoLists.push(todoList('Go to Bank', 'Need to pay the bill', '12/15/2019', 'high', 'Project2'));
    todoLists.push(todoList('Buy some gifts', 'For Christmas', '12/20/2019', 'high', 'Project2'));

    setupApp();
    const addListButton = document.querySelector('#add-list-button');
    addListButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
