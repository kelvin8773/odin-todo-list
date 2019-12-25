import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import Data from './data';
import UI from './ui';
import './style.css';

const Controller = (() => {
  let todoLists = Data.init();
  let projects = Data.getProjects();
  const projectNode = document.getElementById('project-tabs');
  const todoNode = document.getElementById('nav-tabContent');

  const addListener = (todo) => {
    const todoStatus = document.getElementById(`${todo.id}-status`);
    todoStatus.addEventListener('change', () => {
      Data.updateTodo(todo.id);
      updateApp();
    });

    const todoDelete = document.getElementById(`${todo.id}-delete`);
    todoDelete.addEventListener('click', () => {
      Data.deleteTodo(todo.id);
      updateApp();
    });
  };

  const updateApp = () => {
    for (const project of projects) {
      const projectTab = document.getElementById(`${project}-tab`);
      const todoTab = document.getElementById(project);
      const todoList = todoLists.filter(todo => todo.project === project);
      const todoIds = todoList.map(todo => todo.id);
      const selected = (projects.indexOf(project) === 0);

      if (!projectTab) {
        projectNode.append(UI.renderProject(project, selected));
      }

      if (!todoTab) {
        todoNode.append(UI.renderTodoList(todoList, project, selected));
        todoList.forEach(todo => addListener(todo));
      } else {
        const todoListBody = document.getElementById(`${project}-body`);

        for (const todo of todoList) {
          const todoLine = document.getElementById(todo.id);
          if (!todoLine) {
            todoListBody.append(UI.renderTodo(todo));
            addListener(todo);
          } else if (todo.status) {
            todoLine.setAttribute('class', 'text-danger cross-text');
          } else {
            todoLine.setAttribute('class', '');
          }
        }

        for (const node of todoListBody.childNodes) {
          if (!todoIds.includes(node.id)) {
            document.getElementById(node.id).remove();
          }
        }
      }
    }
    UI.updateForm(projects);
  };

  const runApp = () => {
    const todo = UI.getTodo();
    if (todo) Data.addTodo(todo);

    todoLists = Data.getTodo();
    projects = Data.getProjects();

    updateApp();
  };

  const init = () => {
    updateApp();

    const addButton = document.getElementById('add-list-button');
    addButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
