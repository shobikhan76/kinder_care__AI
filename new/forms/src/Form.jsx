import React from 'react';
import {useState} from 'react';

const Form = () => {

    const [email , setEmail ] = useState(''); 
    const [password , setPassword ] = useState(''); 

    const handleSubmit = (e) =>{
        e.preventDefault(); 
        console.log('Email:', email);
        console.log('Password:', password);
    }

    return (
        <form onSubmit = {handleSubmit} > 
        <input type ="email" value={email} placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
        <input type ="password" value = {password} placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
        <button type="submit">Submit</button>
        </form>
    )


}

export default Form;
