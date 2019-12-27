import {
  isAfter, formatDistanceToNow, lightFormat, addDays,
} from 'date-fns';

const UI = (() => {
  const renderTodo = (todo) => {
    const todoLine = document.createElement('tr');
    todoLine.setAttribute('id', todo.id);
    if (todo.status) {
      todoLine.setAttribute('class', 'text-danger cross-text');
    } else {
      todoLine.setAttribute('class', '');
    };

    const listID = document.createElement('th');
    listID.scope = 'row';
    listID.innerText = '#';
    todoLine.append(listID);

    const listTitle = document.createElement('td');
    listTitle.setAttribute('id', `${todo.id}-title`);
    listTitle.innerText = todo.title;
    todoLine.append(listTitle);

    const listDescription = document.createElement('td');
    listDescription.setAttribute('id', `${todo.id}-description`);
    listDescription.innerText = todo.description;
    todoLine.append(listDescription);

    const dueDateHidden = document.createElement('td');
    dueDateHidden.setAttribute('id', `${todo.id}-dueDate`);
    dueDateHidden.setAttribute('hidden', true);
    dueDateHidden.innerText = todo.dueDate;
    todoLine.append(dueDateHidden);

    const listDueDate = document.createElement('td');
    listDueDate.setAttribute('id', `${todo.id}-dueDateDisplay`);
    const dueDate = new Date(todo.dueDate);
    const daysDiff = formatDistanceToNow(dueDate);
    if (isAfter(dueDate, new Date())) {
      listDueDate.innerText = `${daysDiff} left`;
    } else {
      listDueDate.innerText = `${daysDiff} pass`;
    }
    todoLine.append(listDueDate);

    const listPriority = document.createElement('td');
    listPriority.setAttribute('id', `${todo.id}-priority`);
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

    const listUpdate = document.createElement('td');
    const listEdit = document.createElement('span');
    listEdit.setAttribute('id', `${todo.id}-edit`);
    listEdit.setAttribute('class', 'todo-update');
    listEdit.setAttribute('data-toggle', 'modal');
    listEdit.setAttribute('data-target', '#todoModal');
    listEdit.innerHTML = '<i class="far fa-edit fa-lg mr-2"></i>';
    listUpdate.append(listEdit);

    const listDelete = document.createElement('span');
    listDelete.setAttribute('id', `${todo.id}-delete`);
    listDelete.setAttribute('class', 'todo-update');
    listDelete.innerHTML = '<i class="fas fa-trash-alt fa-lg "></i>';
    listUpdate.append(listDelete);

    todoLine.append(listUpdate);

    return todoLine;
  };

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
            <th scope="col">Update</th>
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

  const renderTodoModal = (todo) => {
    document.getElementById('todoEditId').value = todo.id;
    document.getElementById('todoEditTitle').value = todo.title;
    document.getElementById('todoEditDes').value = todo.description;
    document.getElementById('todoEditDueDate').value = lightFormat(new Date(todo.dueDate), 'yyyy-MM-dd');
    document.getElementById('todoEditPriority').value = todo.priority;
    document.getElementById('todoEditProject').value = todo.project;
    document.getElementById('todoEditStatus').checked = todo.status;
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
  };

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
        project: inputProject,
      };
    }
    return false;
  };

  const getTodoUpdate = () => {
    const todoEditId = document.getElementById('todoEditId').value;
    const todoEditTitle = document.getElementById('todoEditTitle').value;
    const todoEditDescription = document.getElementById('todoEditDes').value;
    const todoEditDueDate = document.getElementById('todoEditDueDate').value;
    const todoEditPriority = document.getElementById('todoEditPriority').value;
    const todoEditProject = document.getElementById('todoEditProject').value.split(' ').join('_');
    const todoEditStatus = document.getElementById('todoEditStatus').checked;

    return {
      id: todoEditId,
      title: todoEditTitle,
      description: todoEditDescription,
      dueDate: todoEditDueDate,
      priority: todoEditPriority,
      project: todoEditProject,
      status: todoEditStatus,
    };
  };

  const updateTodo = (todo) => {
    const todoId = todo.id;
    const todoTitle = document.getElementById(`${todoId}-title`);
    const todoDescription = document.getElementById(`${todoId}-description`);
    const todoDueDate = document.getElementById(`${todoId}-dueDate`);
    const todoDueDateDisplay = document.getElementById(`${todoId}-dueDateDisplay`);
    const todoPriority = document.getElementById(`${todoId}-priority`);
    const todoStatus = document.getElementById(`${todoId}-status`);

    if (todoTitle.innerText !== todo.title) todoTitle.innerText = todo.title;
    if (todoDescription.innerText !== todo.description) todoDescription.innerText = todo.description;
    if (todoDueDate.innerText !== todo.dueDate) {
      todoDueDate.innerText = todo.dueDate;
      const dueDate = new Date(todo.dueDate);
      const daysDiff = formatDistanceToNow(dueDate);
      if (isAfter(dueDate, new Date())) {
        todoDueDateDisplay.innerText = `${daysDiff} left`;
      } else {
        todoDueDateDisplay.innerText = `${daysDiff} pass`;
      }
    };
    if (todoPriority.innerText !== todo.priority) todoPriority.innerText = todo.priority;
    if (todoStatus.checked !== todo.status) todoTitle.checked = todo.status;

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

    document.getElementById('add-list-form').reset();
  };

  return {
    renderTodo,
    renderTodoList,
    renderTodoModal,
    renderProject,
    updateForm,
    getTodo,
    getTodoUpdate,
    updateTodo,
  };
})();

export default UI;
