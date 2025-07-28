const form=document.getElementById('uForm');
const message=document.getElementById('message');

form.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value.trim();
    const age=document.getElementById("age").value.trim();

    if(!name||!email||!password||!age){
        message.style.color="red";
        return message.textContent="All fields are required!";
    }

    if(isNaN(age)||age<18){
        message.style.color="red";
        return message.textContent="Age must be a digit ,18 or greater!";
    }

    if(password.length<6){
        message.style.color="red";
        return message.textContent="Password must be atleast 6 characters long!";
    }

    try{
        const res=await fetch('http://localhost:3000/api/submit',{
          method:'POST',
          headers: {'Content-Type':'application/json'},
          body:JSON.stringify({name,email,password,age})
        });

        const data=await res.json();

        if(!res.ok){
            message.style.color="red";
            message.textContent=data.error;
        }else{
            message.style.color="white";
            message.textContent=data.message;
        }
    }

    catch(err)
    {
        message.style.color="red";
        message.textContent="Something went wrong. Try again later!";
    }
});
