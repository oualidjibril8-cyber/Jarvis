// Todo List Application with Local Storage
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.STORAGE_KEY = 'jarvis-todos';
        this.init();
    }

    // Initialize the app
    init() {
        this.loadFromStorage();
        this.attachEventListeners();
        this.render();
    }

    // Attach event listeners
    attachEventListeners() {
        // Add todo button and input
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Action buttons
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
    }

    // Add a new todo
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleString()
        };

        this.todos.push(todo);
        this.saveToStorage();
        this.render();
        input.value = '';
        input.focus();
    }

    // Delete a todo
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
        this.render();
    }

    // Toggle todo completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.render();
    }

    // Clear completed todos
    clearCompleted() {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToStorage();
            this.render();
        }
    }

    // Clear all todos
    clearAll() {
        if (confirm('Are you sure you want to delete all tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    // Get filtered todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    // Update statistics
    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completedTasks').textContent = completed;
    }

    // Render todos
    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        // Clear the list
        todoList.innerHTML = '';

        // Show empty state if no todos
        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
            todoList.style.display = 'none';
        } else {
            emptyState.classList.add('hidden');
            todoList.style.display = 'block';

            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        data-id="${todo.id}"
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
                    <button class="delete-btn" data-id="${todo.id}">Delete</button>
                `;

                // Add checkbox listener
                li.querySelector('.checkbox').addEventListener('change', (e) => {
                    this.toggleTodo(parseInt(e.target.dataset.id));
                });

                // Add delete button listener
                li.querySelector('.delete-btn').addEventListener('click', (e) => {
                    this.deleteTodo(parseInt(e.target.dataset.id));
                });

                todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    // Save to local storage
    saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    }

    // Load from local storage
    loadFromStorage() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.todos = stored ? JSON.parse(stored) : [];
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
    console.log('✅ Todo App loaded successfully!');
});
