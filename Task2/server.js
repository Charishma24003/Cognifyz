const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');

const app=express();
const PORT=3000;

app.use(cors());
app.use(bodyParser.json());

let users=[];

app.post('/api/submit',(req,res)=>{
    const{name,email,age,password}=req.body;

    if(!name||!email||!age||!password){
        return res.status(400).json({error:'All fields are required!'});
    }

    if(isNaN(age)||age<18){
        return res.status(400).json({error:'Age must be a digit 18 or more!'});
    }

    if(password.length<6){
        return res.status(400).json({error:'Password length must be atleast 6 digits!'});
    }    

    const newUser={name,email,age};
    users.push(newUser);

    res.status(200).json({message:'Form Submitted Successfully!!!',user:newUser});
});


app.listen(PORT,()=>{
    console.log(`Running on http://localhost:${PORT}`);
});