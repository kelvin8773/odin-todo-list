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

  const updateApp = () => {
    for (let i = 0; i < projects.length; i += 1) {
      const projectTab = document.getElementById(`${projects[i]}-tab`);
      const todoTab = document.getElementById(`${projects[i]}`);
      const todoList = todoLists.filter((todo) => todo.project === projects[i]);
      const todoIds = todoList.map(todo => todo.id);
      const selected = (i === 0) ? true : false;

      if (!projectTab) {
        projectNode.append(UI.renderProject(projects[i], selected));
      };

      if (!todoTab) {
        todoNode.append(UI.renderTodoList(todoList, projects[i], selected));
      } else {
        const todoListBody = document.getElementById(`${projects[i]}-body`);

        for (let todo of todoList) {
          let todoLine = document.getElementById(todo.id);
          if (!todoLine) {
            todoListBody.append(UI.renderTodo(todo));
          }
          else {
            if (todo.status) {
              todoLine.setAttribute('class', 'text-danger cross-text')
            } else {
              todoLine.setAttribute('class', '');
            }
          }
        };

        for (let node of todoListBody.childNodes) {
          if (!todoIds.includes(node.id)) {
            document.getElementById(node.id).remove();
          }
        };

      }
    }

    UI.updateForm(projects);
  }

  const addEventListener = () => {
    for (let todo of todoLists) {
      const todoStatus = document.getElementById(`${todo.id}-status`);
      todoStatus.addEventListener('change', () => {
        Data.updateTodo(todoLists, todo.id);
        updateApp();
      });

      const todoDelete = document.getElementById(`${todo.id}-delete`);
      todoDelete.addEventListener('click', () => {
        Data.deleteTodo(todoLists, todo.id);
        updateApp();
      });
    }
  };

  const runApp = () => {
    const todo = UI.getTodo();
    if (todo) Data.addTodo(todoLists, todo);

    todoLists = Data.getTodo();
    projects = Data.getProjects();

    updateApp();
    addEventListener();
  };

  const init = () => {
    updateApp();
    addEventListener();

    const addButton = document.getElementById('add-list-button');
    addButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
