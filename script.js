let tasks=[];
let currentFilter='all'
let searchText="";

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks))
}
function loadTasks(){
    let savedTasks = localStorage.getItem('tasks')

    if(savedTasks){
        tasks = JSON.parse(savedTasks)
    }
}

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const priorityInput =document.getElementById("priority-input");
const categoryInput =document.getElementById("category-input");
const dueDateInput =document.getElementById("due-date-input");
const taskList = document.getElementById("task-list");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const searchInput = document.getElementById("search-input");
const allFilter = document.getElementById("all-filter");
const activeFilter = document.getElementById("active-filter");
const completedFilter = document.getElementById("completed-filter");
const themeToggle=document.getElementById("theme-toggle");

function renderTasks(){

    taskList.innerHTML="";
    for(let task of tasks){

        if(!task.text.toLowerCase().includes(searchText)){
            continue
        }

        if(currentFilter ==='active' && task.completed){
            continue
        }
        if(currentFilter==='completed' && !task.completed){
            continue
        }

        let taskItem=document.createElement('li')

        let taskTextElement =document.createElement('span')
        taskTextElement.textContent = task.text

        let priorityElement = document.createElement('span')
        priorityElement.textContent=task.priority
        priorityElement.classList.add('priority')
        priorityElement.classList.add(task.priority)

        let categoryElement=document.createElement('span')
        categoryElement.textContent=task.category
        categoryElement.classList.add('category')

        let dueDateElement=document.createElement('span')
        dueDateElement.textContent=task.dueDate
            ?`Due: ${task.dueDate}`
            :"No Due Date"

            dueDateElement.classList.add("due-date")

            if(
                task.dueDate &&
                task.dueDate < new Date().toISOString().split("T")[0] &&
                !task.completed
            ){
                dueDateElement.classList.add('overdue')
            }

        let editButton = document.createElement('button')
        editButton.textContent='Edit'

        editButton.addEventListener('click',function(){
            let newText = prompt('Edit Your Task: ',task.text)

            if(newText === null){
                return
            }
            if(newText.trim() ===""){
                return
            }

            task.text = newText.trim()

            saveTasks()
            renderTasks()
        })

        let completeButton = document.createElement('button')
        completeButton.textContent='Complete'

        if(task.completed){
            taskTextElement.style.textDecoration='line-through'
            completeButton.textContent ='undo'
        }

        completeButton.addEventListener('click',function(){
            task.completed = !task.completed
            saveTasks()
            renderTasks()
            updateCounter()
        })

        let deleteButton = document.createElement('button')
        deleteButton.textContent='delete'

        deleteButton.addEventListener('click',function(){
            let taskIndex = tasks.findIndex(function(item){
                return item.id === task.id
            })
            tasks.splice(taskIndex,1)
            saveTasks()
            renderTasks()
            updateCounter()
        })


        taskItem.appendChild(taskTextElement)
        taskItem.appendChild(priorityElement)
        taskItem.appendChild(categoryElement)
        taskItem.appendChild(dueDateElement)
        taskItem.appendChild(editButton)
        taskItem.appendChild(completeButton)
        taskItem.appendChild(deleteButton)

        taskList.appendChild(taskItem)
        
    }
}

allFilter.addEventListener('click',function(){
    currentFilter = 'all'
    renderTasks()
})

activeFilter.addEventListener('click',function(){
    currentFilter='active'
    renderTasks()
})

completedFilter.addEventListener('click',function(){
    currentFilter='completed'
    renderTasks()
})

function updateCounter(){
    let total = tasks.length

    let completed = tasks.filter(function(task){
        return task.completed
    }).length

    totalTasks.textContent = total
    completedTasks.textContent=completed
}


taskForm.addEventListener("submit",function(event){
    event.preventDefault();
    let taskText = taskInput.value;

    if(taskText.trim()===""){
        return
    }

    let task ={
        id:Date.now(),
        text:taskText,
        completed:false,
        priority:priorityInput.value,
        category: categoryInput.value,
        dueDate:dueDateInput.value,
    }
    tasks.push(task)

    saveTasks()
    renderTasks()
    updateCounter()
    taskInput.value ="";
    priorityInput.value = "medium";
    categoryInput.value = "study";
    dueDateInput.value = "";
})

    searchInput.addEventListener('input',function(){
        searchText=searchInput.value.toLowerCase()
        renderTasks()
    })

    themeToggle.addEventListener('click',function(){
        document.body.classList.toggle('dark-mode')

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

    })

    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

   
    loadTasks()
    renderTasks()
    updateCounter()