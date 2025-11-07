let displayList = document.getElementById("task-list");
let todoList = [];


window.onload = () => {
  let savedTasks = localStorage.getItem("todoList");
  if (savedTasks) {
    todoList = JSON.parse(savedTasks); 
    displayTasks();
  }
};

const handleInput = () => {
  let inputElement = document.getElementById("task-input");
  let inp = inputElement.value.trim();

  if (inp === "") {
    alert("Please enter a task");
    return;
  }

  todoList.push({ id: Date.now(), task: inp, completed: false });
  inputElement.value = "";

  
  localStorage.setItem("todoList", JSON.stringify(todoList));

  displayTasks();
};

const displayTasks = () => {
  displayList.innerHTML = "";

  todoList.forEach((task) => {
    let listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex align-items-center justify-content-between rounded-3 mb-2 shadow-sm";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-3";
    checkbox.checked = task.completed;

    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      listItem
        .querySelector(".task-text")
        .classList.toggle("completed", task.completed);

      
      localStorage.setItem("todoList", JSON.stringify(todoList));
    };

    let span = document.createElement("span");
    span.className = "task-text flex-grow-1";
    span.textContent = task.task;
    if (task.completed) span.classList.add("completed");

    let btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

  
    let editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-primary";
    editBtn.textContent = "Edit";

    editBtn.onclick = () => {
      let inputElement = document.getElementById("task-input");
      let addBtn = document.getElementById("add-btn");
      addBtn.disabled = true;
      inputElement.value = task.task;
      inputElement.focus();

      editBtn.textContent = "Save";
      editBtn.classList.replace("btn-outline-primary", "btn-success");

      editBtn.onclick = () => {
        let updated = inputElement.value.trim();
        if (updated === "") {
          alert("Task cannot be empty");
          return;
        }

        task.task = updated;
        inputElement.value = "";
        addBtn.disabled = false;

        
        localStorage.setItem("todoList", JSON.stringify(todoList));

        displayTasks();
      };
    };

    
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => deleteTaskWithModal(task.id);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    listItem.appendChild(checkbox);
    listItem.appendChild(span);
    listItem.appendChild(btnGroup);
    displayList.appendChild(listItem);
  });

  
  let taskToDelete = null;

  const deleteTaskWithModal = (taskId) => {
    taskToDelete = taskId;
    const deleteModal = new bootstrap.Modal(
      document.getElementById("deleteModal")
    );
    deleteModal.show();
  };

  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", () => {
      if (taskToDelete !== null) {
        todoList = todoList.filter((task) => task.id !== taskToDelete);
        taskToDelete = null;
        displayTasks();

        
        localStorage.setItem("todoList", JSON.stringify(todoList));

        const modalEl = document.getElementById("deleteModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
      }
    });
};
