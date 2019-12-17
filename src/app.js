import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './style.css';

// UI 

const render = (todoLists) => {
  let projectLists = getProjectList(todoLists);
  renderProjectTabs(projectLists);
  renderTodoList(todoLists);
  renderProjectListForm(projectLists);
}

const renderProjectTabs = (projectLists) => {
  let projectTabs = document.getElementById('project-tabs');
  projectTabs.innerHTML = '';

  for (let projectList of projectLists) {
    let projectTab = document.createElement('a');
    projectTab.setAttribute('class', "nav-item nav-link active");
    projectTab.setAttribute('id', projectList + "-tab");
    projectTab.setAttribute('data-toggle', "tab");
    projectTab.setAttribute('href', "#" + projectList);
    projectTab.setAttribute('role', "tab");
    projectTab.setAttribute('aria-controls', projectList);
    projectTab.setAttribute('aria-selected', "true");
    projectTab.innerText = projectList;

    projectTabs.append(projectTab);

  }
}

const renderTodoList = (todoLists) => {
  const listTableBody = document.querySelector('#list-table-body');
  listTableBody.innerHTML = '';
  for (let i = 0; i < todoLists.length; i += 1) {
    const listLine = document.createElement('tr');

    const listID = document.createElement('th');
    listID.scope = 'row';
    listID.innerText = i + 1;
    listLine.append(listID);

    const listTitle = document.createElement('td');
    listTitle.innerText = todoLists[i].title;
    listLine.append(listTitle);

    const listDescription = document.createElement('td');
    listDescription.innerText = todoLists[i].description;
    listLine.append(listDescription);

    const listDueDate = document.createElement('td');
    listDueDate.innerText = todoLists[i].dueDate;
    listLine.append(listDueDate);

    const listPriority = document.createElement('td');
    listPriority.innerText = todoLists[i].priority.toUpperCase();
    listLine.append(listPriority);

    listTableBody.append(listLine);
  }
};


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
  let finish = false;
  const getFinish = () => finish;
  const setFinish = () => {
    finish = !finish;
    return finish;
  };

  return {
    title,
    description,
    dueDate,
    priority,
    getFinish,
    setFinish,
    project
  };
};

const addTodoList = (todoLists) => {
  const inputTitle = document.querySelector('#todoTitle').value;
  const inputDescription = document.querySelector('#todoDescription').value;
  let inputDueDate = document.querySelector('#dueDate').value;
  const inputPriority = document.querySelector('#todoPriority').value;
  const inputProject = document.getElementById('todoProject').value;

  if (inputTitle.length === 0) {
    window.location.reload();
  } else {
    if (inputDueDate.length === 0) {
      inputDueDate = '12/3/2019';
    }
    todoLists.push(todoList(inputTitle, inputDescription, inputDueDate, inputPriority, inputProject));
  }
};

const getProjectList = (todoLists) => {
  return todoLists.map((list) => list.project);
}

// app logic 
const Controller = (() => {
  const todoLists = [];

  const setupApp = () => {
    render(todoLists);
  }

  const runApp = () => {
    addTodoList(todoLists);
    setupApp();
  };

  const init = () => {
    // Add sample todo lists
    todoLists.push(todoList('Buy Food', 'For Next Week', '12/3/2019', 'medium', 'Home Project'));
    todoLists.push(todoList('Go to Bank', 'Need to pay the bill', '12/15/2019', 'high', 'Office Project'));

    setupApp();
    const addListButton = document.querySelector('#add-list-button');
    addListButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
