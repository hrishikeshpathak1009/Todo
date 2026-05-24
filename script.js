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

const intervalInput =document.querySelector("#intervalInput");

const chartCanvas =document.querySelector("#productivityChart");

let currentFilter = "all";
let productivityChart = null;
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
        priority: priority,
        completedAt: null
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

intervalInput.addEventListener(
    "input",
    function () {

        renderChart();

    }
);

//FUNCTIONS BELOW

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


function renderTasks() {
    const interval =
    Number(intervalInput.value);

console.log(
    getProductivityData(interval)
);
    
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

        if (task.priority === 3) {
    li.style.borderLeft = "5px solid red";
}

if (task.priority === 2) {
    li.style.borderLeft = "5px solid orange";
}

if (task.priority === 1) {
    li.style.borderLeft = "5px solid green";
}

        li.textContent =`${task.text} (Priority: ${getPriorityLabel(task.priority)})`;;

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
           
            li.classList.add("completed-task");
            
        }


        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        li.addEventListener("click", function () {

            task.completed = !task.completed;

            if(task.completed){
                task.completedAt= new Date().toISOString();
            }
            else {
                task.completedAt=null;
            }
            saveTasks();
            renderTasks();
            
        });

    }
    renderChart();

}

function getPriorityLabel(priority) {

    if (priority === 1) {
        return "Low";
    }

    if (priority === 2) {
        return "Medium";
    }

    return "High";

}

function getProductivityData(intervalMinutes) {

    const totalBuckets = Math.ceil((24 * 60) / intervalMinutes);

    const productivityData =new Array(totalBuckets).fill(0);

    for (let task of tasks) {
        if (task.completed && task.completedAt) {
            const date = new Date(task.completedAt);

const totalMinutes =
    date.getHours() * 60 +
    date.getMinutes();

const bucketIndex =
    Math.floor(totalMinutes / intervalMinutes);

productivityData[bucketIndex] += task.priority;
        }

    }
    return productivityData;

}


function renderChart() {
    const interval = Number(intervalInput.value);
const labels=[];
    const data = getProductivityData(interval);
    for (let i = 0; i < data.length; i++) {

    const totalMinutes = i * interval;

    const hour =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;

        
    labels.push(
        `${hour}:${minutes
            .toString()
            .padStart(2, "0")}`
    );

}
    if (productivityChart) {

    productivityChart.destroy();

}

productivityChart = new Chart(chartCanvas, {type: "line",data: {

    labels: labels,

    datasets: [

        {
            label: "Productivity",

            data: data,

            borderColor: "#00ffae",

            backgroundColor:
                "rgba(0,255,174,0.2)",

            tension: 0.3
        }

    ]

},options: {

    responsive: true,

    scales: {

        y: {

            beginAtZero: true

        }

    }

}
});



}