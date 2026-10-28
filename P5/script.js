// File: script.js
document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
    const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // Fitur 1: Fungsi untuk memperbarui jumlah tugas
    const updateTaskCounter = (tasks) => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${pending}`;
    };

    const checkTaskLimit = (tasks) => {
    if (tasks.length >= 5) {
        taskInput.disabled = true;
        document.querySelector(".add-btn").disabled = true;
        inputError.textContent = "Maksimal hanya 5 tugas yang dapat disimpan!";
        inputError.style.display = "block";
    } else {
        taskInput.disabled = false;
        document.querySelector(".add-btn").disabled = false;
        inputError.style.display = "none";
    }
};

    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";

        updateTaskCounter(tasks);

        if (tasks.length === 0) {
            todoList.innerHTML = "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? 'Batal' : 'Selesai'}
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    };

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }

        taskInput.classList.remove("error");
        inputError.style.display = "none";

        const tasks = getTasks();
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);

        taskInput.value = "";
        renderTasks();
    });

    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;

        const tasks = getTasks();

        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
            renderTasks();
        } else if (e.target.classList.contains("delete-btn")) {
            // Fitur 3: Konfirmasi Sebelum Menghapus
            const isConfirmed = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
            if (isConfirmed) {
                tasks.splice(index, 1);
                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // Fitur 2: Bersihkan Tugas Selesai
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();
        const remainingTasks = tasks.filter(task => !task.completed);
        saveTasks(remainingTasks);
        renderTasks();
    });

    renderTasks();
});