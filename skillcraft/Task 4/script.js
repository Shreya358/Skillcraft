const taskInput = document.getElementById('taskInput');
const taskDateTime = document.getElementById('taskDateTime');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const alertSound = new Audio('https://www.soundjay.com/button/beep-07.wav');

addBtn.addEventListener('click', addTask);
displayTasks();

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

function addTask() {
  const text = taskInput.value.trim();
  const dateTime = taskDateTime.value;

  if (text === '') return alert('Please enter a task!');
  if (dateTime === '') return alert('Please select date and time!');

  const task = {
    id: Date.now(),
    text,
    dateTime,
    completed: false,
    notified: false
  };

  tasks.push(task);
  saveTasks();
  displayTasks();
  scheduleNotification(task);

  taskInput.value = '';
  taskDateTime.value = '';
}

function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-text');
    taskDiv.textContent = task.text;

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('task-time');
    timeDiv.textContent = task.dateTime ? `🕒 ${task.dateTime}` : '';

    const btnDiv = document.createElement('div');
    btnDiv.classList.add('buttons');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit');
    editBtn.onclick = () => editTask(task.id);

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Done';
    completeBtn.classList.add('complete');
    completeBtn.onclick = () => toggleComplete(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.onclick = () => deleteTask(task.id);

    btnDiv.append(editBtn, completeBtn, deleteBtn);
    li.append(taskDiv, timeDiv, btnDiv);
    taskList.appendChild(li);
  });
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Edit task:', task.text);
  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    saveTasks();
    displayTasks();
  }
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  displayTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  displayTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function scheduleNotification(task) {
  const taskTime = new Date(task.dateTime).getTime();
  const now = new Date().getTime();
  const delay = taskTime - now;

  if (delay > 0) {
    setTimeout(() => {
      showNotification(task.text);
      alertSound.play();
      task.notified = true;
      saveTasks();
    }, delay);
  }
}

function showNotification(taskText) {
  if (Notification.permission === 'granted') {
    new Notification('⏰ Task Reminder', {
      body: `It's time for: ${taskText}`,
      icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
    });
  } else {
    alert(`⏰ It's time for: ${taskText}`);
  }
}

tasks.forEach(task => {
  if (!task.notified && !task.completed) {
    scheduleNotification(task);
  }
});
