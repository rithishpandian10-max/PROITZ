function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) {
        window.location.replace("index.html");
    }
}
checkLogin();
window.addEventListener("pageshow", checkLogin);
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

let prompts=[];
let activeCategory="All";
let searchText="";

let profileBtn=document.getElementById("initial");
let popProfile=document.getElementById("profile-view");
let closeProfile=document.getElementById("close-profile");
let showName=document.getElementById("popup-name");
let showMail=document.getElementById("popup-email");
let showInitial=document.getElementById("initial-pop");

profileBtn.addEventListener("click",()=>{
    popProfile.classList.toggle("hidden");
});
closeProfile.addEventListener("click",()=>{
    popProfile.classList.add("hidden");
});
document.addEventListener("click",(e)=>{
    if(!popProfile.contains(e.target) && !profileBtn.contains(e.target)){
    popProfile.classList.add("hidden");
    }
})

const user = JSON.parse(localStorage.getItem("currentUser")) || {};
let name=user.name||"Your name";
let profileEmail=user.email||"your@gmail.com"

showInitial.textContent=name.charAt(0).toUpperCase();
showName.textContent=name;
showMail.textContent=profileEmail;


let repoPrompts=JSON.parse(localStorage.getItem("repoKey")) || {};
let favoritePrompt=JSON.parse(localStorage.getItem("proitz-fav")) || {};
if(!repoPrompts[profileEmail]){
    repoPrompts[profileEmail]=[];
}
if(!favoritePrompt[profileEmail]){
    favoritePrompt[profileEmail]=[];
}
document.getElementById("repo-count").textContent=repoPrompts[profileEmail.toLowerCase()].length;
document.getElementById("fav-count").textContent=favoritePrompt[profileEmail.toLowerCase()].length;





const logoutBtn = document.getElementById("logout-profile");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.replace("index.html");
    });
}








function getPrompts(){
    return JSON.parse(localStorage.getItem(key)) || [];
}
function savePrompts(list){
    localStorage.setItem(key,JSON.stringify(list));
}

function getUserFavorites(){
    let user =JSON.parse(localStorage.getItem("currentUser"));
    if(!user || !user.email)return [];
    let allFavorites=JSON.parse(localStorage.getItem("proitz-fav"))||{};
    let email =user.email.trim().toLowerCase();
    return allFavorites[email]||[];
}


function renderCategories(){
    let categoryName=["All",...new Set(prompts.map(p=>p.category))];
    console.log(prompts.map(p=>p.category));
    console.log(categoryName)
    let buttons=[];
    for (let name of categoryName){
        let on="";
        if (name==activeCategory){
            on="on";
        }
        let button=`<button class="category ${on} glass-effect" data-cat="${name}">${name}</button>`;
        buttons.push(button);
    }
    let html=buttons.join("");
    console.log(html)
    document.getElementById("categories").innerHTML=html;
}


function visiblePrompts(){
    let word=searchText.trim().toLowerCase();
    return prompts.filter(p=>{
        let categoryFilter=activeCategory === "All" || p.category === activeCategory;
        let searchFilter=p.text.toLowerCase().includes(word) || p.category.toLowerCase().includes(word);
        return categoryFilter && searchFilter;
    })
}

function getShortPrompts(text, maxChars=150){
    if(text.length<=maxChars)return text;
    return text.slice(0, maxChars)+"...";
}


function promptDivision(){
    let list = visiblePrompts();
    document.querySelector("#result-count").textContent = list.length + " prompts";

    document.querySelector("#prompt-list").innerHTML=list.map(prom=>
    `<div class="prompt-card glass-effect" data-id="${prom.id}">
      <div class="top">
        <span class="category-title">${prom.category}</span>
      </div>
      <p class="prompt-text">${getShortPrompts(prom.text, 150)}</p>
      <p class="prompt-author">By${prom.author}</p>
      <button class="copy" id="copy" data-action="copy">Copy prompt</button>
    </div>`

    ).join("");
}


let promptModal=document.getElementById("prompt-modal");
let closeModal=document.getElementById("close-modal");
let categoryDetail=document.getElementById("detail-category");
let detailTitle=document.getElementById("detail-title");
const detailAuthor = document.getElementById("detail-author");
const detailText = document.getElementById("detail-text");
let body=document.querySelector(".wrap")
function openPromptDetails(prompt){
    categoryDetail.textContent=prompt.category||"general";
    detailAuthor.textContent=`By ${prompt.author || "unknown"}`;
    detailText.textContent=prompt.text||"";
    promptModal.style.display="flex";
    body.style.overflow="hidden";
}
function closePromptDetails(){
    promptModal.style.display="none";
    body.style.overflow="scroll"
}
document.getElementById("prompt-list").addEventListener("click",event=>{
    const clickedText=event.target.closest(".prompt-text");
    if(!clickedText)return;
    const card=clickedText.closest(".prompt-card");
    if(!card)return;
    const prompt=prompts.find(
        p=>p.id===card.dataset.id
    );
    if(prompt){
        openPromptDetails(prompt);
    }
});
closeModal.addEventListener("click",closePromptDetails);


function render(){
    renderCategories();
    promptDivision();
}
document.addEventListener("click", ele => {
    let clickedButton = ele.target.closest("[data-cat]");

    if (clickedButton) {
        activeCategory = clickedButton.dataset.cat;
        render();
        return;
    }
});

let searchInput = document.querySelector(".main-search");

searchInput.addEventListener("input", () => {
    searchText = searchInput.value;
    promptDivision();
});

document.addEventListener("click",(event)=>{
    let heart =event.target.closest(`[data-action="favorite"]`);
    if(!heart)return;
    
    let card=heart.closest(".prompt-card");
    let promptId=card.dataset.id;
    let user=JSON.parse(localStorage.getItem("currentUser"));
    if(!user || !user.email)return;
    
    let allFavorites=JSON.parse(localStorage.getItem("proitz-fav"))||{};
    let email=user.email.trim().toLowerCase();
    allFavorites[email]=(allFavorites[email] || []).filter(
        prompt => String(prompt.id) !== String(promptId)
    );
    localStorage.setItem("proitz-fav",JSON.stringify(allFavorites));
    prompts=getUserFavorites();
    render();
});


let searchBar=document.querySelector(".main-search");
let isFocused=false;

document.addEventListener("keydown",(event)=>{
    if(event.key=='/'){
        if(!isFocused){
            event.preventDefault();
        }
        searchBar.focus();
    }
})
searchBar.addEventListener("focus",()=>{
   isFocused=true;
})
searchBar.addEventListener("blur",()=>{
   isFocused=false;
})



document.addEventListener("click", function(event) {
    let button = event.target.closest('[data-action="copy"]');
    if (!button) return;
    let card = button.closest(".prompt-card");
    let id = card.dataset.id;
    let prompt = prompts.find(p => String(p.id) === String(id));
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.text);
    button.textContent = "Copied!";
    setTimeout(() => button.textContent = "Copy prompt", 1500);
});


function showUser() {
    if (!currentUser) {
        window.location.replace("index.html");
        return;
    }

    const initial = document.getElementById("initial");
    initial.textContent = currentUser.name.charAt(0).toUpperCase();
}
showUser();



prompts=getUserFavorites();
render();