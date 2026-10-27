async function hashPassword(password){
    const data =new TextEncoder().encode(password);
    const hash=await crypto.subtle.digest("SHA-256",data);
    return Array.from(new Uint8Array(hash)).map(byte=> byte.toString(16).padStart(2,"0")).join("");
}

const form=document.querySelector(".login-card");
const greet=document.getElementById("greet");
const nameLabel=document.querySelector(".name-label");
const name=document.getElementById("Name");
const email=document.getElementById("email");
const errorMsg=document.getElementById("error");
const changeText=document.getElementById("changing-text");
const switchLink=document.getElementById("account-create");
const submitBtn=document.getElementById("submit-btn");
const password=document.getElementById("password");
let mode="login";
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;


switchLink.addEventListener("click",function (e){
    e.preventDefault();
    errorMsg.textContent="";
    email.value = "";
    password.value = "";
    if(mode==="login"){
        mode="signUp";
        name.classList.remove("hidden");
        nameLabel.classList.remove("hidden");
        greet.textContent = "Create your account";
        submitBtn.textContent = "Sign up";
        changeText.textContent = "Already have an account?";
        switchLink.textContent = "Log in";
    }
    else{
        mode = "login";
        name.classList.add("hidden");
        nameLabel.classList.add("hidden");
        greet.textContent = "Welcome back";
        submitBtn.textContent = "Log in";
        changeText.textContent = "New here?";
        switchLink.textContent = "Create account";
    }
});


form.addEventListener("submit",async function(e){
    e.preventDefault();
    let emailValue=email.value.trim().toLowerCase();
    let passwordValue=password.value;
    let users=JSON.parse(localStorage.getItem("users"))||[];


    if (mode=="signUp"){
        let userName=name.value.trim();
        if(userName==""){
            errorMsg.textContent="please Enter Your name.";
            return;
        }
        if(!passwordRegex.test(passwordValue)){
            errorMsg.textContent="Weak Password";
            return;
        }
        if(users.find(ele=> ele.email===emailValue)){
            errorMsg.textContent="This email already has an account.";
            return;
        }
        let hashedPassword= await hashPassword(passwordValue);
        users.push( {name:userName,email:emailValue,password:hashedPassword});
        localStorage.setItem("users",JSON.stringify(users));
        localStorage.setItem("currentUser",JSON.stringify({name:userName,email:emailValue}));
        window.location.href = "../HTML/home.html";
    }
    else{
        let hashedPassword= await hashPassword(passwordValue);
        let user=users.find(ele=> ele.email===emailValue && ele.password ===hashedPassword);
        if(!user){
            errorMsg.textContent="Invalid credential";
            return;
        }
        localStorage.setItem("currentUser",JSON.stringify({name:user.name,email:user.email}));
        window.location.href = "../HTML/home.html";
    }
})