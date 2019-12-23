import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import Data from './data';
import UI from './ui';
import './style.css';

let todoLists = [];

// app logic
const Controller = (() => {
  const setupApp = () => {

  }

  const runApp = () => {
    Data.addTodo();
    todoLists = Data.getData();
    UI.render(todoLists);
  };

  const init = () => {
    todoLists = Data.init();
    UI.render(todoLists);
    const addListButton = document.getElementById('add-list-button');
    addListButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
