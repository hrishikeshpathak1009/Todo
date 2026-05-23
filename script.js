const input = document.querySelector("#taskInput");

const button = document.querySelector("#addBtn");

const taskList = document.querySelector("#taskList");


const tasks = [];


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

    renderTasks();
input.value = "";

});
function renderTasks() {
    console.log(tasks);

    taskList.innerHTML = "";

    for (let task of tasks) {

        const li = document.createElement("li");

        li.textContent = task.text;

        const deleteBtn = document.createElement("button");

deleteBtn.textContent = "Delete";


deleteBtn.addEventListener("click", function () {

    const filteredTasks = tasks.filter(function (t) {

        return t.id !== task.id;

    });

    tasks.length = 0;

    tasks.push(...filteredTasks);

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