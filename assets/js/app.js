/**
 * Representa una tarea individual
 */
class Task {
    constructor(text) {
        this.id = Date.now().toString();
        this.text = text;
        this.completed = false;
        this.createdAt = new Date();
    }
}

/**
 * Gestiona el estado de la aplicación y la persistencia
 */
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.listElement = document.getElementById('task-list');
        this.form = document.getElementById('task-form');
        this.input = document.getElementById('task-input');
        this.totalCount = document.getElementById('total-count');
        this.completedCount = document.getElementById('completed-count');

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.render();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        if (text) {
            this.addTask(text);
            this.input.value = '';
        }
    }

    addTask(text) {
        const newTask = new Task(text);
        this.tasks.push(newTask);
        this.saveAndRender();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveAndRender();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveAndRender();
    }

    saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.render();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        
        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
    }

    render() {
        this.listElement.innerHTML = '';
        
        this.tasks.sort((a, b) => b.createdAt - a.createdAt).forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            taskItem.innerHTML = `
                <div class="custom-checkbox" onclick="app.toggleTask('${task.id}')"></div>
                <span>${this.escapeHTML(task.text)}</span>
                <button class="delete-btn" onclick="app.deleteTask('${task.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
            `;
            
            this.listElement.appendChild(taskItem);
        });

        this.updateStats();
    }

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
}

// Inicializar la aplicación
const app = new TaskManager();
