import Data from './data'
import { isAfter, formatDistanceToNow, lightFormat, addDays } from 'date-fns';

const UI = (() => {

  const renderTodo = (todo) => {
    const todoLine = document.createElement('tr');
    todoLine.setAttribute('id', todo.id);
    if (todo.status) {
      todoLine.setAttribute('class', 'text-danger cross-text');
    }

    const listID = document.createElement('th');
    listID.scope = 'row';
    listID.innerText = '#';
    todoLine.append(listID);

    const listTitle = document.createElement('td');
    listTitle.innerText = todo.title;
    todoLine.append(listTitle);

    const listDescription = document.createElement('td');

    listDescription.innerText = todo.description;
    todoLine.append(listDescription);

    const listDueDate = document.createElement('td');
    const dueDate = new Date(todo.dueDate);
    const daysDiff = formatDistanceToNow(dueDate);
    if (isAfter(dueDate, new Date())) {
      listDueDate.innerText = `${daysDiff} to go`;
    } else {
      listDueDate.innerText = `${daysDiff} pass due`;
    }
    todoLine.append(listDueDate);

    const listPriority = document.createElement('td');
    listPriority.innerText = todo.priority;
    todoLine.append(listPriority);

    const listStatus = document.createElement('td');
    listStatus.setAttribute('id', `${todo.id}-status`);
    if (todo.status) {
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
    todoLine.append(listStatus);

    const listDelete = document.createElement('td');
    listDelete.setAttribute('id', `${todo.id}-delete`);
    listDelete.setAttribute('class', 'text-secondary delete-todo');
    listDelete.innerHTML = '<i class="fas fa-trash-alt fa-lg ml-3"></i>';
    todoLine.append(listDelete);

    return todoLine;
  }

  const renderTodoList = (todoList, project, selected) => {
    const todoListTab = document.createElement('div');
    if (selected) {
      todoListTab.setAttribute('class', 'tab-pane fade show active');
    } else {
      todoListTab.setAttribute('class', 'tab-pane fade');
    }
    todoListTab.setAttribute('id', project);
    todoListTab.setAttribute('role', 'tabpanel');
    todoListTab.setAttribute('aria-labelledby', `${project}-tab`);

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
    todoListBody.setAttribute('id', `${project}-body`);
    todoListBody.innerHTML = '';
    for (let i = 0; i < todoList.length; i += 1) {
      todoListBody.append(renderTodo(todoList[i]));
    }

    todoListTable.append(todoListBody);
    todoListTab.append(todoListTable);

    return todoListTab;
  };

  const renderProject = (project, selected) => {
    const projectTab = document.createElement('a');
    if (selected === true) {
      projectTab.setAttribute('class', 'nav-item nav-link active');
      projectTab.setAttribute('aria-selected', 'true');
    } else {
      projectTab.setAttribute('class', 'nav-item nav-link');
      projectTab.setAttribute('aria-selected', 'false');
    }

    projectTab.setAttribute('id', `${project}-tab`);
    projectTab.setAttribute('data-toggle', 'tab');
    projectTab.setAttribute('href', `#${project}`);
    projectTab.setAttribute('role', 'tab');
    projectTab.setAttribute('aria-controls', project);
    projectTab.innerText = project;

    return projectTab;
  }

  const getTodo = () => {
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
        inputDueDate = lightFormat(addDays(new Date(), 1), 'MM/dd/yyyy');
      }

      return {
        title: inputTitle,
        description: inputDescription,
        dueDate: inputDueDate,
        priority: inputPriority,
        project: inputProject
      }
    }
  }

  const updateForm = (projects) => {
    const addListForm = document.getElementById('add-list-form');
    const projectDatalist = document.getElementById('project-Lists');
    projectDatalist.innerHTML = '';

    for (let i = 0; i < projects.length; i += 1) {
      const projectListOption = document.createElement('option');
      projectListOption.value = projects[i];
      projectDatalist.append(projectListOption);
    }
    addListForm.append(projectDatalist);

    document.getElementById('add-list-form').reset();
  };

  return {
    renderTodo,
    renderTodoList,
    renderProject,
    updateForm,
    getTodo,
  };
})();

export default UI;

