import React, { useState } from 'react'; 
const list = ['bnana' , 'apple' , 'orange' ];
const TodoList = () =>{
    const [item , setItem ] = useState(''); 
    const [todos , setTodos ] = useState([]); 


    const hadledAdd = (e) =>{
        setTodos([...todos , item]);
        setItem('');

    }
    
  const handleDelete = (index) =>{
    const newTodos = todos.filter((item , idx)=> idx !==index) ; 
    setTodos(newTodos);
  }


return (
    <div> 
    <input type="text" value={item} onChange={(e)=>{setItem(e.target.value)}}/>
    <button onClick={hadledAdd}>Add</button>
    <ul>
        {todos.map((todo , index) =>(
            <li key={index}>{todo}
            <button onClick ={()=>handleDelete(index)}>Delete</button>
            <button onClick = {handleEdit(index)}>Edit</button>
            </li>
            
        ))}
    </ul>
    </div>

)

}
export default TodoList;