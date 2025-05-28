const input = document.querySelector("#input");
const button = document.querySelector("#button");
const taskList = document.querySelector("#task-list");
const progressText = document.getElementById("numbers");
const progressBar = document.getElementById("progress");

let tasks = [];
button.title='Add Task';

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = saved;
  renderAllTasks();
  updateProgress();
};

button.addEventListener("click", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    const task = { text: text, done: false };
    tasks.push(task);
    saveTasks();
    input.value = "";
    renderAllTasks();
    updateProgress();
  }
});

function updateTasksList(text, done) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.innerText = text;

  if (done) li.classList.add("done");

  const controls = document.createElement("span");
  controls.classList.add("task-controls");

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.title = "Edit";
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit your task:", text);
    if (newText) {
      const task = tasks.find((t) => t.text === text);
      if (task) {
        task.text = newText;
        saveTasks();
        renderAllTasks();
      }
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.text !== text);
    saveTasks();
    renderAllTasks();
    updateProgress();
  });

  controls.appendChild(editBtn);
  controls.appendChild(deleteBtn);
  li.appendChild(controls);
  li.addEventListener("click", (e) => {
    if (e.target === li) {
      const task = tasks.find((t) => t.text === text);
      if (!task) return;

      task.done = !task.done;
      saveTasks();
      renderAllTasks();
      updateProgress();
    }
  });

  taskList.appendChild(li);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderAllTasks() {
  taskList.innerHTML = "";
  const sortedTasks = [...tasks].sort((a, b) => a.done - b.done);
  sortedTasks.forEach((task) => updateTasksList(task.text, task.done));
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  progressText.innerText = `${done}/${total}`;

  const percent = total === 0 ? 0 : (done / total) * 100;
  progressBar.style.width = `${percent}%`;
}
