import {useState,useEffect} from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTasks from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import './index.css'

const App = () => {
  const[showAddTask,setShowAddTask] = useState(false)
  const [tasks,setTasks] = useState([])


  useEffect(()=>{
   const getTasks = async () =>{
     const taskFromServer = await fetchTasks()
     setTasks(taskFromServer)
   }


    getTasks()
  },[])

// Fetch Tasks

const fetchTasks = async () =>{
  const res = await fetch ('http://localhost:7000/tasks')
  const data = await res.json()
  return data
}

const fetchTask = async (id) =>{
  const res = await fetch (`http://localhost:7000/tasks/${id}`)
  const data = await res.json()
  return data
}


// Add Tasks

const addTask = async (task) => {
  const res = await fetch(`http://localhost:7000/tasks`,{
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json()
  setTasks([...tasks,data])

  // const id = Math.floor(Math.random()*100) + 1
  // const newTask = {id, ...task}
}


// Delete Tasks

  const deleteTask = async (id) => {
    await fetch(`http://localhost:7000/tasks/${id}`,{
      method: 'DELETE',
    })
    setTasks(tasks.filter((task)=> {
      return task.id !== id;
    }))
  }


  // Toggle Reminder
  const toggleReminder = async (id)=> {
    const taskToToggle = await fetchTask(id)
    const updTask={...taskToToggle,reminder:!taskToToggle.reminder}

    const res = await fetch(`http://localhost:7000/tasks/${id}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task)=> 
    task.id === id ? {...task, reminder:
      data.reminder} : task
    )
  )
}


  return (
    <Router>
    <div className="container">
    <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
    <Route path='/' exact render={(props)=>(
    <>
    {showAddTask && <AddTasks 
    onAdd={addTask}/>}
    {tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>) : ('No Task To Show')}
    </>)}/>
    <Route path='/about' component={About}/>
    <Footer/>
    </div>
    </Router>
  );
};

export default App;
