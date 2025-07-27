const express=require('express');
const bodyParser=require('body-parser');
const e = require('express');
const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('form');
});

app.post('/submit',(req,res)=>{
    const{name,email}=req.body;
    res.render('response',{name,email});
});

app.listen(3000,()=>{
    console.log('Server running at http://localhost:3000');
});