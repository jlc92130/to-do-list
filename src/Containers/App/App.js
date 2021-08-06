import React, { useState, useRef, useEffect } from 'react';
import classes from './App.module.css';
import Task from '../../Components/Task/Task';
import axios from '../../axios-firebase';

function App() {

  // States
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // Fonctions
  const removeClickedHandler = index => {
    
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    axios.delete('/tasks/'+ tasks[index].id + '.json');

  }

  const doneClickedHandler = index => {
    const newTasks = [...tasks]; // copy state
    newTasks[index].done = !tasks[index].done; // if false then true
    setTasks(newTasks);
    // update firebase database after modif
    axios.put('/tasks/'+ newTasks[index].id + '.json', {params: newTasks[index]})
      .then(rsp => {
        console.log(rsp);
      })
      .catch(error => {
        console.log(error);
      });  
  }

  const submittedTaskHandler = event => {
    event.preventDefault();

    const newTask = {
      content: input,
      done: false
    }
    setTasks([...tasks, newTask]);
    setInput('');
    axios.post('/tasks.json', newTask)
      .then(rsp => {
        console.log(rsp);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const changedFormHandler = event => {
    setInput(event.target.value);
  }

   

  // Variables
  let tasksDisplayed = tasks.map((task, index) => (
    <Task
      done={task.done}
      content={task.content}
      key={index}
      removeClicked={() => removeClickedHandler(index)}
      doneClicked={() => doneClickedHandler(index)}
    />
  ));
  // creation of a reference
  const inputTask = useRef(null);
  // let donedTasks = tasks.filter(task => task.done)
  //   .map((filteredTask, index) => (
  //     <Task
  //       done={filteredTask.done}
  //       content={filteredTask.content}
  //       key={index}
  //       removeClicked={() => removeClickedHandler(index)}
  //       doneClicked={() => doneClickedHandler(index)}
  //     />
  // ));

  // componentDidMount (refresh page, add task..)
  useEffect(() => {
    inputTask.current.focus();

    axios.get('/tasks.json')
    .then(rsp => {
      const getTasksFromFirebase = [];
      Object.keys(rsp.data).map(key => {
        getTasksFromFirebase.push({
          ...rsp.data[key], // for each key we get the value distructuring
          id: key
        })
      })
      setTasks(getTasksFromFirebase); // update state
    })
    .catch(error => {
      console.log(error);
    });
  }, []);
  

  return (
    <div className={classes.App}>
      <header>
        <span>TO-DO</span>
      </header>

      <div className={classes.add}>
        <form onSubmit={(e) => submittedTaskHandler(e)}>
          <input
            ref={inputTask}
            type="text"
            value={input}
            onChange={(e) => changedFormHandler(e)}
            placeholder="Que souhaitez-vous ajouter ?" />
          <button type="submit">
            Ajouter
          </button>
        </form>
      </div>

      {tasksDisplayed}
    </div>
  );
}

export default App;
