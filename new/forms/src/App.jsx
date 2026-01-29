import React from "react"
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Form from './Form.jsx'
import TodoList from './TodoList.jsx'
function App() {
 

  return (
    <>
     <h1 className="font-bold text-2xl" > Forms </h1>
     <TodoList />
     
     
    </>
  )
}

export default App
