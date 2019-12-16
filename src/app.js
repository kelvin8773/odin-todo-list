import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './style.css';

const todoLists = [];



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

const renderList = (listArray) => {
  const listTableBody = document.querySelector('#list-table-body');
  for (let i = 0; i < listArray.length; i += 1) {
    const listLine = document.createElement('tr');

    const listID = document.createElement('th');
    listID.scope = 'row';
    listID.innerText = i + 1;
    listLine.append(listID);

    const listTitle = document.createElement('td');
    listTitle.innerText = listArray[i].title;
    listLine.append(listTitle);

    const listDescription = document.createElement('td');
    listDescription.innerText = listArray[i].description;
    listLine.append(listDescription);

    const listDueDate = document.createElement('td');
    listDueDate.innerText = listArray[i].dueDate;
    listLine.append(listDueDate);

    const listPriority = document.createElement('td');
    listPriority.innerText = listArray[i].priority.toUpperCase();
    listLine.append(listPriority);

    listTableBody.append(listLine);
  }
};

const addList = (listArray) => {
  const inputTitle = document.querySelector('#todoTitle').value;
  const inputDescription = document.querySelector('#todoDescription').value;
  let inputDueDate = document.querySelector('#dueDate').value;
  const inputPriority = document.querySelector('#todoPriority').value;

  if (inputTitle.length === 0) {
    window.location.reload();
  } else {
    if (inputDueDate.length === 0) {
      inputDueDate = '12/3/2019';
    }
    listArray.push(todoList(inputTitle, inputDescription, inputDueDate, inputPriority));
  }
};

const clearTable = () => {
  document.querySelector('#list-table-body').innerHTML = '';
};

const Controller = (() => {
  todoLists.push(todoList('Buy Food', 'For Next Week', '12/3/2019', 'medium', 'project1'));
  todoLists.push(todoList('Go to Bank', 'Need to pay the bill', '12/15/2019', 'high', 'project2'));

  let projectList = todoLists.map((list) => list.project);
  console.log(projectList);

  renderList(todoLists);

  const runApp = () => {
    addList(todoLists);
    clearTable();
    renderList(todoLists);
  };



  const init = () => {
    const addListButton = document.querySelector('#add-list-button');
    addListButton.addEventListener('click', runApp);
  };

  return {
    init,
  };
})();

Controller.init();
