// This file contains JavaScript code for the frontend of the Smart Task Organizer application.
// It handles user interactions, makes AJAX calls to the API, and updates the UI based on the responses.

const API_URL = 'http://localhost/HMLab/smart-task-organizer/api/index.php';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('taskForm').addEventListener('submit', handleAddTask);
    document.getElementById('filterSelect').addEventListener('change', loadTasks);
    document.getElementById('sortSelect').addEventListener('change', loadTasks);
    document.getElementById('exportBtn').addEventListener('click', exportTasks);
}

// Load and display tasks
async function loadTasks() {
    try {
        const filter = document.getElementById('filterSelect').value;
        const sort = document.getElementById('sortSelect').value;

        let url = API_URL;
        const params = new URLSearchParams();
        if (filter) params.append('filter', filter);
        if (sort) params.append('sort', sort);
        if (params.toString()) url += '?' + params.toString();

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === 'success') {
            displayTasks(result.data);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks');
    }
}

// Display tasks
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state"><p>No tasks yet. Add one to get started! 🚀</p></div>';
        return;
    }

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksList.appendChild(taskCard);
    });
}

// Create task card element
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status === 'Completed' ? 'completed' : ''}`;
    card.id = `task-${task.id}`;

    const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'No deadline';

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        <div class="task-meta">
            <span class="deadline">📅 ${deadline}</span>
            <span class="status" style="color: ${task.status === 'Completed' ? '#4CAF50' : '#ff9800'}">
                ${task.status === 'Completed' ? '✓ Completed' : '⏳ To Do'}
            </span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-actions">
            ${task.status !== 'Completed' ? 
                `<button class="btn-complete" onclick="toggleTaskStatus(${task.id}, 'Completed')">✓ Complete</button>` :
                `<button class="btn-complete" onclick="toggleTaskStatus(${task.id}, 'ToDo')" style="background: #ff9800;">↩ Reopen</button>`
            }
            <button class="btn-edit" onclick="editTask(${task.id})">Edit</button>
            <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    return card;
}

// Toggle task completion status
async function toggleTaskStatus(id, newStatus) {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });

        const result = await response.json();
        if (result.status === 'success') {
            loadTasks();
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task');
    }
}

// Edit task
async function editTask(id) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            const task = result.data;
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('priority').value = task.priority;
            if (task.deadline) {
                document.getElementById('deadline').value = task.deadline.slice(0, 16);
            }

            const form = document.getElementById('taskForm');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Task';

            // Store the task ID in a data attribute
            form.dataset.editingId = id;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error loading task:', error);
        alert('Failed to load task');
    }
}

// Add new task
async function handleAddTask(e) {
    e.preventDefault();

    const form = document.getElementById('taskForm');
    const editingId = form.dataset.editingId;

    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        deadline: document.getElementById('deadline').value || null,
        priority: document.getElementById('priority').value
    };

    try {
        let response;
        
        if (editingId) {
            // Update existing task
            formData.id = editingId;
            formData.status = 'ToDo';
            response = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new task
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        const result = await response.json();
        if (result.status === 'success') {
            form.reset();
            delete form.dataset.editingId;
            document.querySelector('button[type="submit"]').textContent = 'Add Task';
            loadTasks();
            alert(editingId ? 'Task updated successfully! ✓' : 'Task added successfully! ✓');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save task');
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const result = await response.json();
        if (result.status === 'success') {
            loadTasks();
            alert('Task deleted successfully! ✓');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

// Export tasks to text file
async function exportTasks() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.status === 'success') {
            let textContent = 'SMART TASK ORGANIZER - EXPORT\n';
            textContent += '=' .repeat(50) + '\n';
            textContent += `Generated: ${new Date().toLocaleString()}\n\n`;

            result.data.forEach((task, index) => {
                textContent += `Task ${index + 1}: ${task.title}\n`;
                textContent += `-`.repeat(40) + '\n';
                textContent += `Status: ${task.status}\n`;
                textContent += `Priority: ${task.priority}\n`;
                textContent += `Deadline: ${task.deadline || 'No deadline'}\n`;
                if (task.description) {
                    textContent += `Description: ${task.description}\n`;
                }
                textContent += '\n';
            });

            downloadFile(textContent, 'tasks_export.txt');
        }
    } catch (error) {
        console.error('Error exporting tasks:', error);
        alert('Failed to export tasks');
    }
}

// Download file helper
function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}