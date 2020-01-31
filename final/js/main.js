let todoList = [];
const currentMode = "all";
const modes = ["all", "incomplete", "complete"];

function newTodo(task) {
  return { id: Date.now(), task: task, isDone: false };
}

function addTodo(todo, todoList) {
  return [...todoList, todo];
}

function removeTodo(todo, todoList) {
  let temp = [];
  for (let i = 0; i < todoList.length; i++) {
    const _todo = todoList[i];
    if (todo.id !== _todo.id) {
      temp.push(_todo);
    }
  }
  return temp;
}

function updateTodo(todo, todoList) {
  let temp = [];
  for (let i = 0; i < todoList.length; i++) {
    const _todo = todoList[i];
    if (todo.id === _todo.id) {
      temp.push(todo);
    } else {
      temp.push(_todo);
    }
  }
  return temp;
}

document.addEventListener("DOMContentLoaded", function() {
  // start here
  renderTodoApp(document.body);

  function renderTodoApp(parent) {
    const app = newTodoApp();
    parent.appendChild(app);
  }

  function newTodoApp() {
    const appContainer = document.createElement("div");
    appContainer.id = "root-container";

    const modeContainer = document.createElement("div");
    modeContainer.id = "mode-container";

    const formContainer = document.createElement("div");
    formContainer.id = "form-container";

    const listContainer = document.createElement("div");
    listContainer.id = "list-container";

    const modeElement = newModeElement(currentMode);
    modeContainer.appendChild(modeElement);

    const todoForm = newTodoFormElement();
    formContainer.appendChild(todoForm);

    appContainer.appendChild(formContainer);
    appContainer.appendChild(modeContainer);
    appContainer.appendChild(listContainer);

    return appContainer;
  }

  function renderMode(currentMode) {
    const modeContainer = document.getElementById("mode-container");
    modeContainer.innerHTML = "";

    const modeList = newModeElement(currentMode);
    modeContainer.appendChild(modeList);
  }

  function newModeElement(currentMode) {
    const div = document.createElement("div");
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      const span = document.createElement("span");
      span.textContent = mode;
      span.classList.add("mode");
      if (mode === currentMode) {
        span.classList.add("active");
      }

      span.addEventListener("click", function() {
        currentMode = mode;
        renderMode(mode);
        renderTodoListElement(todoList, mode);
      });

      div.appendChild(span);
    }
    return div;
  }

  function newTodoFormElement() {
    const todoForm = document.createElement("form");

    const taskLbl = document.createElement("label");
    taskLbl.setAttribute("for", "task");
    taskLbl.textContent = "Task: ";

    const taskInput = document.createElement("input");
    taskInput.id = "task";
    taskInput.name = "task";
    taskInput.type = "text";
    taskInput.placeholder = "what you want to do?";
    taskInput.autofocus = true;

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "submit";
    submitBtn.type = "submit";

    todoForm.appendChild(taskLbl);
    todoForm.appendChild(taskInput);
    todoForm.appendChild(submitBtn);

    todoForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const task = taskInput.value;
      if (task.trim() === "") {
        return;
      }
      const todo = newTodo(task);
      todoList = addTodo(todo, todoList);
      renderTodoListElement(todoList, currentMode);
      taskInput.value = "";
    });

    return todoForm;
  }

  function renderTodoListElement(todoList, mode) {
    const listContainer = document.getElementById("list-container");
    listContainer.innerHTML = "";

    const listElement = newTodoListElement(todoList, mode);
    listContainer.appendChild(listElement);
  }

  function newTodoListElement(todoList, mode) {
    const ul = document.createElement("ul");
    if (mode === "complete") {
      for (let i = 0; i < todoList.length; i++) {
        const _todo = todoList[i];
        if (_todo.isDone) {
          const todoElement = newTodoElement(_todo);
          ul.appendChild(todoElement);
        }
      }
    } else if (mode === "incomplete") {
      for (let i = 0; i < todoList.length; i++) {
        const _todo = todoList[i];
        if (!_todo.isDone) {
          const todoElement = newTodoElement(_todo);
          ul.appendChild(todoElement);
        }
      }
    } else {
      for (let i = 0; i < todoList.length; i++) {
        const todoElement = newTodoElement(todoList[i]);
        ul.appendChild(todoElement);
      }
    }

    return ul;
  }

  function newTodoElement(todo) {
    const li = document.createElement("li");

    const doneCbx = document.createElement("input");
    doneCbx.id = `done-${todo.id}`;
    doneCbx.type = "checkbox";
    doneCbx.checked = todo.isDone;
    doneCbx.addEventListener("click", function(event) {
      todo.isDone = event.target.checked;
      todoList = updateTodo(todo, todoList);
      renderTodoListElement(todoList, currentMode);
    });

    const taskLbl = document.createElement("label");
    taskLbl.setAttribute("for", `done-${todo.id}`);
    taskLbl.textContent = todo.task;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "remove";

    li.appendChild(doneCbx);
    li.appendChild(taskLbl);
    li.appendChild(removeBtn);

    removeBtn.addEventListener("click", function() {
      todoList = removeTodo(todo, todoList);
      renderTodoListElement(todoList, currentMode);
    });

    return li;
  }
});
