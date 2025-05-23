document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');
    const editModal = document.getElementById('editModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const closeModal = document.getElementById('closeModal');

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentEditId = null;

    // Initialize the app
    function init() {
        renderTasks();
        addEventListeners();
    }

    // Add event listeners
    function addEventListeners() {
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        closeModal.addEventListener('click', closeEditModal);
        saveEditBtn.addEventListener('click', saveEditedTask);
    }

    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    // Render all tasks
    function renderTasks() {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        const pendingTasks = tasks.filter(task => !task.completed);
        const completedTasks = tasks.filter(task => task.completed);

        pendingCount.textContent = pendingTasks.length;
        completedCount.textContent = completedTasks.length;

        pendingTasks.forEach(task => {
            pendingTasksList.appendChild(createTaskElement(task));
        });

        completedTasks.forEach(task => {
            completedTasksList.appendChild(createTaskElement(task));
        });
    }

    // Create task element
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item bg-gray-50 rounded-lg p-3 flex items-start gap-3';
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mt-1';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        const taskContent = document.createElement('div');
        taskContent.className = 'flex-1';

        const taskText = document.createElement('span');
        taskText.className = task.completed ? 'line-through text-gray-500' : 'text-gray-800';
        taskText.textContent = task.text;

        const taskMeta = document.createElement('div');
        taskMeta.className = 'text-xs text-gray-500 mt-1';
        const date = new Date(task.createdAt);
        taskMeta.textContent = `Added: ${date.toLocaleString()}`;

        if (task.completed) {
            const completedDate = new Date(task.completedAt);
            const completedMeta = document.createElement('div');
            completedMeta.className = 'text-xs text-green-500 mt-1';
            completedMeta.textContent = `Completed: ${completedDate.toLocaleString()}`;
            taskMeta.appendChild(completedMeta);
        }

        taskContent.appendChild(taskText);
        taskContent.appendChild(taskMeta);

        const actions = document.createElement('div');
        actions.className = 'flex gap-2';

        const editBtn = document.createElement('button');
        editBtn.className = 'text-indigo-500 hover:text-indigo-700';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditModal(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-500 hover:text-red-700';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(taskContent);
        li.appendChild(actions);

        return li;
    }

    // Toggle task completion
    function toggleTaskCompletion(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return;

        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        tasks[taskIndex].completedAt = tasks[taskIndex].completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
    }

    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Open edit modal
    function openEditModal(id) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;

        currentEditId = id;
        editTaskInput.value = task.text;
        editModal.classList.remove('hidden');
        editTaskInput.focus();
    }

    // Close edit modal
    function closeEditModal() {
        editModal.classList.add('hidden');
        currentEditId = null;
    }

    // Save edited task
    function saveEditedTask() {
        const newText = editTaskInput.value.trim();
        if (newText === '') return;

        const taskIndex = tasks.findIndex(task => task.id === currentEditId);
        if (taskIndex === -1) return;

        tasks[taskIndex].text = newText;
        saveTasks();
        renderTasks();
        closeEditModal();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Initialize the app
    init();
});