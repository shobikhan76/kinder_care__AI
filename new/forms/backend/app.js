import express from 'express'; 
const app = express() ; 

app.use(express.json()) ; 
app.get('/' , (req , res) =>{
    res.send(
     "hello server is running "
    )
})


export default app ; 