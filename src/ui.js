import Data from './data'
import { isAfter, formatDistanceToNow } from 'date-fns';

const UI = (() => {

  const renderTodo = (todo) => {
    const todoLine = document.createElement('tr');
    if (todo.status) {
      todoLine.setAttribute('class', 'text-danger cross-text');
    }

    const listID = document.createElement('th');
    listID.scope = 'row';
    listID.innerText = todo.id.slice(1, 3);
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
    // listStatus.addEventListener('change', () => {
    //   Data.updateTodo(todoLists, todo.id);
    //   renderTodoListTabs(Data.getData());
    // });
    todoLine.append(listStatus);

    const listDelete = document.createElement('td');
    listDelete.setAttribute('class', 'text-secondary delete-todo');
    listDelete.innerHTML = '<i class="fas fa-trash-alt fa-lg ml-3"></i>';
    // listDelete.addEventListener('click', () => {
    //   Data.deleteTodo(todoLists, todo.id);
    //   renderTodoListTabs(Data.getData());
    // });
    todoLine.append(listDelete);

    return todoLine;
  }

  const renderTodoList = (lists, node) => {
    node.innerHTML = '';
    for (let i = 0; i < lists.length; i += 1) {
      node.append(renderTodo(lists[i]));
    }
    return node;
  };

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

    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('todoPriority').value = '';
    document.getElementById('todoProject').value = '';
  };

  const renderProjectTabs = (projects) => {
    const projectTabNode = document.getElementById('project-tabs');
    // projectTabNode.innerHTML = '';

    for (let i = 0; i < projects.length; i += 1) {
      const projectTab = document.getElementById(`${projects[i]}-tab`);
      if (!projectTab) {
        let selected = false;
        if (i === 0) selected = true;
        projectTabNode.append(renderProject(projects[i], selected));
      };
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



  const render = (todoLists) => {
    const projects = Data.getProjects();

    if (projects.length !== 0) renderProjectTabs(projects);
    if (todoLists.length !== 0) renderTodoListTabs(todoLists);

    updateForm(projects);
  };

  return {
    render,
    updateForm,
    renderTodo,
  };
})();

export default UI;

