const taskStats = document.querySelector("#taskStats");

const input = document.querySelector("#taskInput");

const button = document.querySelector("#addBtn");

const taskList = document.querySelector("#taskList");

const prioritySelect = document.querySelector("#prioritySelect");

const allBtn = document.querySelector("#allBtn");

const completedBtn = document.querySelector("#completedBtn");

const pendingBtn = document.querySelector("#pendingBtn");

const savedTasks = localStorage.getItem("tasks");

const tasks = savedTasks ? JSON.parse(savedTasks) : [];

let currentFilter = "all";

renderTasks();

//BUTTONS EVENT TRIGGER

//Add task button
button.addEventListener("click", function () {

    const taskText = input.value.trim();
    const priority = Number(prioritySelect.value);

    if (taskText === "") {
        return;
    }
    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: priority
    });
    saveTasks();

    renderTasks();
    input.value = "";

});


//Filtering buttons

allBtn.addEventListener("click", function () {

    currentFilter = "all";

    renderTasks();

});

completedBtn.addEventListener("click", function () {

    currentFilter = "completed";

    renderTasks();

});

pendingBtn.addEventListener("click", function () {

    currentFilter = "pending";

    renderTasks();

});


//FUNCTIONS BELOW

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


function renderTasks() {
    console.log(tasks);

    taskList.innerHTML = "";

    const completedTasks = tasks.filter(function (task) {

        return task.completed;

    });
    //for task completeion %age 
    const completedCount = completedTasks.length;

    const totalCount = tasks.length;

    const percentage = totalCount === 0
        ? 0
        : Math.round((completedCount / totalCount) * 100);

    //for productivity score
    let completedWeight = 0;

    let totalWeight = 0;

    for(let task of tasks){
        totalWeight+=task.priority;
        if(task.completed){
            completedWeight+=task.priority;
        }
    }

    const productivityScore = totalWeight === 0
    ? 0
    : Math.round((completedWeight / totalWeight) * 100);

    taskStats.textContent = `Completed ${completedCount} / ${totalCount} tasks (${percentage}%)   ||  Productivity Score : ${productivityScore}`;

    let filteredTasks = tasks;

    if (currentFilter === "completed") {

    filteredTasks = tasks.filter(function (task) {

        return task.completed;

    });

    }
    if (currentFilter === "pending") {

    filteredTasks = tasks.filter(function (task) {

        return !task.completed;

    });

    }


    for (let task of filteredTasks) {

        const li = document.createElement("li");

        li.textContent =`${task.text} (Priority: ${task.priority})`;;

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";


        deleteBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            const updatedTasks = tasks.filter(function (t) {

                return t.id !== task.id;
                

            });

            tasks.length = 0;

            tasks.push(...updatedTasks);
            saveTasks();

            renderTasks();

        });

        if (task.completed) {
            li.style.color="green";
            li.style.textDecoration = "line-through";
        }


        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        li.addEventListener("click", function () {

            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            
        });

    }

}