
function getTaskLength() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  return db.length;
}

function getActiveTaskLength() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let activeItems = db.filter((item) => item.status === "active");

  return activeItems.length;
}
function getItems() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  console.log("All items: ", db);
  if (db.length > 0) {
    let activeItems = db.filter((item) => item.status === "active");
    console.log("Active items: ", activeItems);
    generateItems(activeItems, "active");
    let completedItems = db.filter((item) => item.status === "completed");
    console.log("Completed items: ", completedItems);
    generateItems(completedItems, "completed");
  }
  updateTask();
}

function generateItems(items, status) {
  let todoContainer = document.querySelector("#todo-items");
  if (status === "active") {
    todoContainer.innerHTML = "";
  }
  items.forEach((item) => {
    let todoItem = document.createElement("div");
    todoItem.dataset.itemId = item.id;
    todoItem.classList.add("todo-item");

    let left = document.createElement("div");
    left.classList.add("left");

    let check = document.createElement("div");
    check.classList.add("check");
    if (item.status === "completed") {
      check.classList.add("checked");
    }

    let checkMark = document.createElement("div");
    checkMark.classList.add("check-mark");
    if (item.status === "completed") {
      checkMark.classList.add("checked");
    }
    checkMark.addEventListener("click", function () {
      toggleCheckClass(checkMark);
    });

    checkMark.innerHTML = '<i class="fa-solid fa-check"></i>';
    check.appendChild(checkMark);

    let todoTextElm = document.createElement("div");
    todoTextElm.classList.add("todo-text");
    if (item.status === "completed") {
      todoTextElm.classList.add("checked");
    }

    let todoInput = document.createElement("input");
    todoInput.classList.add("text");
    todoInput.type = "text";
    todoInput.value = item.todoText;
    todoInput.setAttribute("readonly", "readonly");

    todoTextElm.appendChild(todoInput);

    left.appendChild(check);
    left.appendChild(todoTextElm);

    let right = document.createElement("div");
    right.classList.add("right");

    let edit = document.createElement("div");
    edit.classList.add("edit");
    if (item.status === "completed") {
      edit.classList.add("hide");
    }
    edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    let del = document.createElement("div");
    del.classList.add("del");
    del.innerHTML = '<i class="fa-solid fa-trash"></i>';
    del.addEventListener("click", function (event) {
      removeTodo(event.target);
    });

    edit.addEventListener("click", (e) => {
      editTodo(e.target);
    });

    right.appendChild(edit);
    right.appendChild(del);

    todoItem.appendChild(left);
    todoItem.appendChild(right);
    if (status === "active") {
      todoContainer.insertBefore(todoItem, todoContainer.firstChild);
    } else {
      todoContainer.appendChild(todoItem);
    }
  });
}

function updateTask() {
  let totalTasks = getTaskLength();
  let activeTask = getActiveTaskLength();

  console.log("Update Task Called: ", totalTasks);

  const total = document.querySelector(".items-left");
  const activeT = document.querySelector(".activeT");
  const completedT = document.querySelector(".completedT");

  total.innerText = `Task (${totalTasks})`;
  activeT.innerText = `Active (${activeTask})`;
  completedT.innerText = `Completed (${totalTasks - activeTask})`;
}

function removeChecked() {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach(function (item) {
    let itemId = item.dataset.itemId;
    let checkMark = item.querySelector(".check-mark");
    if (checkMark.classList.contains("checked")) {
      db = db.filter((i) => i.id !== itemId);
      item.remove();
    }
  });
  localStorage.setItem("todoList", JSON.stringify(db));
  updateTask();
}
function toggleCheckClass(element) {
  element.classList.toggle("checked");
  const todoText = element.closest(".todo-item").querySelector(".todo-text");
  if (element.classList.contains("checked")) {
    todoText.classList.add("checked");
    Sound.play();
  } else {
    todoText.classList.remove("checked");
    
  }

  let itemId = element.closest(".todo-item").dataset.itemId;
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let itemIndex = db.findIndex((i) => i.id === itemId);
  if (itemIndex !== -1) {
    db[itemIndex].status =
      db[itemIndex].status === "active" ? "completed" : "active";
    localStorage.setItem("todoList", JSON.stringify(db));
    getItems();
  }
}
function removeTodo(delButton) {
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  let todoItem = delButton.closest(".todo-item");
  let itemId = todoItem.dataset.itemId;
  db = db.filter((item) => item.id !== itemId);
  console.log("inside db: ", db);
  localStorage.setItem("todoList", JSON.stringify(db));
  todoItem.parentNode.removeChild(todoItem);
  updateTask();
}
function editTodo(editButton) {
  let todoItem = editButton.closest(".todo-item");
  let todoInput = todoItem.querySelector(".todo-text input");

  if (editButton.classList.contains("fa-pen-to-square")) {
    editButton.classList.remove("fa-pen-to-square");
    editButton.classList.add("fa-save");
    todoInput.removeAttribute("readonly");
    todoInput.focus();
  } else {
    editButton.classList.remove("fa-save");
    editButton.classList.add("fa-pen-to-square");
    todoInput.setAttribute("readonly", "readonly");
    let itemId = todoItem.dataset.itemId;
    let db = JSON.parse(localStorage.getItem("todoList")) || [];
    let itemIndex = db.findIndex((i) => i.id === itemId);
    if (itemIndex !== -1) {
      db[itemIndex].todoText = todoInput.value;
      localStorage.setItem("todoList", JSON.stringify(db));
    }
  }
}
function generateRandomString(length) {
  var characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "todo";
  for (var i = 0; i < length - 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function addItem(event) {
  event.preventDefault();
  let db = JSON.parse(localStorage.getItem("todoList")) || [];
  console.log("Add Called, Lentght of DB: ", db.length);
  let textInput = document.querySelector("#todo-input");
  let newTodo = {
    todoText: textInput.value,
    status: "active",
    id: generateRandomString(10)
  };
  console.log("data added");
  db.push(newTodo);
  localStorage.setItem("todoList", JSON.stringify(db));
  textInput.value = "";
  getItems();
  updateTask();
}
getItems();
