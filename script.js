const taskStats = document.querySelector("#taskStats");

const input = document.querySelector("#taskInput");

const button = document.querySelector("#addBtn");

const taskList = document.querySelector("#taskList");


const savedTasks = localStorage.getItem("tasks");

const tasks = savedTasks ? JSON.parse(savedTasks) : [];

renderTasks();

button.addEventListener("click", function () {

    const taskText = input.value;

    if (taskText === "") {
        return;
    }
    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });
    saveTasks();

    renderTasks();
    input.value = "";

});



function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}




function renderTasks() {
    console.log(tasks);

    taskList.innerHTML = "";

    const completedTasks = tasks.filter(function (task) {

        return task.completed;

    });

    const completedCount = completedTasks.length;

    const totalCount = tasks.length;

    const percentage = totalCount === 0
        ? 0
        : Math.round((completedCount / totalCount) * 100);

    taskStats.textContent = `Completed ${completedCount} / ${totalCount} tasks (${percentage}%)`;

    for (let task of tasks) {

        const li = document.createElement("li");

        li.textContent = task.text;

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";


        deleteBtn.addEventListener("click", function () {

            const filteredTasks = tasks.filter(function (t) {

                return t.id !== task.id;
                saveTasks();

            });

            tasks.length = 0;

            tasks.push(...filteredTasks);
            saveTasks();

            renderTasks();

        });




        if (task.completed) {
            li.style.textDecoration = "line-through";
        }


        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        li.addEventListener("click", function () {

            task.completed = !task.completed;

            renderTasks();

        });

    }

}