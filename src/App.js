import { useState, useEffect} from "react"
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  
useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }
  getTasks()
}, [])

//Fetch Tasks
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
}
//Fetch Task
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

//Add Task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks',{
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  const data =await res.json()
  setTasks([...tasks, data])

 //const id= Math.floor(Math.random() * 10000) + 1
 //const newTask = {id, ...task}
 //setTasks([...tasks, newTask])
}


   //Delete Task
   const deleteTask = async (id) => {
     await fetch(`http://localhost:5000/tasks/${id}`, {
       method: 'DELETE',
     })

     setTasks(tasks.filter((task) => task.id !== id))
   }

   //Toggle reminder
   const tooggleReminder = async (id) => {
     const taskToToggle = await fetchTask(id)
      const updTask={...taskToToggle,
      reminder: !taskToToggle.reminder}

      const res = await fetch(`http://localhost:5000/tasks/${id}`,{
        method:'PUT',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask)
      })

      const data = await res.json()
     
      setTasks(
       tasks.map((task) =>
       task.id === id ? {...task, reminder:
        data.reminder} : task))
   }

  return (
    <div className='container'>
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {tasks.length > 0 ? 
      (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={tooggleReminder}/>) 
      : ('No Tasks To Show HiHiHi')}
      {showAddTask && <AddTask onAdd={addTask}/>}
    </div>
    
  );
}

export default App;
