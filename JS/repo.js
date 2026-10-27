function checkLogin() {
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentuser || !currentuser.email) {
        window.location.replace("index.html");
    }
}
checkLogin();
window.addEventListener("pageshow", checkLogin);


let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const publicKey="proitzDefault";
const repoKey="repoKey";
let savePrompts=document.getElementById("save-prompt");
let activeCategory="All";
let searchText="";
let prompts=getMyRepo();
let editingPromptId = null;


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



function showToast(message){
    let container =document.getElementById("toast");
    if(!container)return;
    let toast=document.createElement("div");
    toast.className="toast";
    toast.textContent=message;
    container.appendChild(toast);
    setTimeout(()=>{
        toast.classList.add("hide");
        setTimeout(()=>toast.remove(),300);
    },3000);
}


function showUser() {
    if (!currentUser) {
        window.location.replace("index.html");
        return;
    }

    const initial = document.getElementById("initial");
    initial.textContent = currentUser.name.charAt(0).toUpperCase();
}

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










function getUser(){
    return JSON.parse(localStorage.getItem("currentUser")) || null;
}

function getUserKey() {
    let user = getUser();
    return user ? String(user.email).trim().toLowerCase() : "";
}
function toGetallFavorites(){
    return JSON.parse(localStorage.getItem("proitz-fav")) || {};
}

function getRepos() {
    return JSON.parse(localStorage.getItem(repoKey)) || {};
}

function getMyRepo() {
    let key = getUserKey();
    return key ? (getRepos()[key] || []) : [];
}

function saveMyRepo(items) {
    let key = getUserKey();
    if (!key) return false;
    let repos = getRepos();
    repos[key] = items;
    localStorage.setItem(repoKey, JSON.stringify(repos));
    return true;
}

function toGetPublic(){
    return JSON.parse(localStorage.getItem(publicKey)) || [];
}
function toSavePublic(items){
    return localStorage.setItem(publicKey,JSON.stringify(items));
}

function safe(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}


function openForm() {
    document.querySelector(".form-area").classList.remove("hidden");
}
function closeForm() {
    document.querySelector(".form-area").classList.add("hidden");
}




savePrompts.addEventListener("click",()=>{
    let user=getUser();
    let text = document.getElementById("repo-text").value.trim();
    let category = document.getElementById("repo-category").value.trim();
    let publicCheck=document.getElementById("public-check");
    if (!text || !category) {
        showToast("Enter prompt and category!");
        return;
    }
    let items= getMyRepo();
    let pubItems=toGetPublic();
    if(editingPromptId){
        let prompt =items.find(p =>p.id === editingPromptId);
        if(!prompt){
           showToast("Prompt not found!");
        }
        prompt.text=text;
        prompt.category=category;
        pubItems=pubItems.map(p => p && p.id===editingPromptId ? {...p,text:text,category:category} : p)
        toSavePublic(pubItems);
    }
    else{
        let prompt={
            id: "d-" + Math.random().toString(36).slice(2, 10),
            author: user.name || "PROITZ",
            category: category,
            likes: [],
            public: false,
            text: text
        };
    items.unshift(prompt);
    }
    if (saveMyRepo(items)) {
        editingPromptId = null;
        document.getElementById("repo-text").value = "";
        document.getElementById("repo-category").value = "";
        savePrompts.textContent = "Save Prompt";
        closeForm();
        render();

    } else {
        showToast("Prompt could not be saved.");

    }
});
getUserKey();









function renderCategories(){
    prompts=getMyRepo();
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
    prompts=getMyRepo();
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

    document.querySelector("#prompt-list").innerHTML=`<button class="addd glass-effect" id="add" title="Add New Prompt"><i class="fa-solid fa-plus"></i>Add New Prompt</button>`+list.map(prom=>
    `<div class="prompt-card glass-effect" data-id="${prom.id}">
      <div class="top">
        <span class="category-title">${prom.category}</span>
      </div>
      <p class="prompt-text">${getShortPrompts(prom.text, 150)}</p>
      <p class="prompt-author">By${prom.author}</p>
      <div class="crud-controls">
         <button class="glass-effect" data-action="edit" title="edit"><i class="fa-solid fa-pen co"></i></button>
         <button class="glass-effect" data-action="delete" title="delete"><i class="fa-solid fa-trash-can co"></i></button>
         <button data-action="post" class="glass-effect">
                ${prom.public ? `<i class="fa-solid fa-user-lock co"></i>` : `<i class="fa-solid fa-earth-americas co"></i>`}
      </button>
      </div>
      <button class="copy" data-action="copy">Copy prompt</button>
      <button class="add-favorite glass-effect ${toGetFavorites().some(f => String(f.id) === String(prom.id))? 'favorited' : ''}"data-action="favorite">${toGetFavorites().some(f => String(f.id) === String(prom.id)) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}</button>
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

document.addEventListener("click", (event) => {
    let button = event.target.closest('[data-action="delete"]');
    if (!button) return;
    let card =button.closest(".prompt-card");
    let promptId =card.dataset.id;
    if(!confirm("Confirm to delete this prompt"))return;
    let items=getMyRepo();
    let pubItem=toGetPublic();
    pubItem=pubItem.filter(prompt => prompt.id !==promptId)
    toSavePublic(pubItem);
    items=items.filter(prompt => prompt.id !== promptId);
    let allFav=toGetallFavorites();
    for(let email in allFav){
        allFav[email]=allFav[email].filter(
            prompt => String(prompt.id) !== String(promptId)
        );
    }
    localStorage.setItem("proitz-fav",JSON.stringify(allFav));
    if(saveMyRepo(items)){
        render();
        showToast("Prompt deleted successfully!");
    }
});

document.addEventListener("click", event =>{
    let button = event.target.closest("[data-action='edit']");
    if(!button)return;
    let card =button.closest(".prompt-card");
    let promptId =card.dataset.id;
    let items=getMyRepo();
    let prompt=items.find(p => p && p.id ==promptId);
    if(!prompt)return;
    editingPromptId=prompt.id;
    document.getElementById("repo-text").value=prompt.text;
    document.getElementById("repo-category").value=prompt.category;
    savePrompts.textContent="Update Prompt";
    openForm();
    toSavePublic(pubItem);
});

const logoutBtn = document.getElementById("logout-profile");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.replace("index.html");
    });
}



// function toggleFavorite(promptId) {
// let favorites = JSON.parse(localStorage.getItem("proitzFavorites")) || [];
// let prompt = prompts.find(p => p.id === promptId);
// if (!prompt) return;
// let index = favorites.findIndex(p => p.id === promptId);
// if (index !== -1) {
// favorites.splice(index, 1);
// } else {
// favorites.push(prompt);
// }
// localStorage.setItem("proitzFavorites", JSON.stringify(favorites));
// }
function toGetFavorites(){
    if(!currentUser || !currentUser.email)return [];
    let  allFav=toGetallFavorites();
    let email=currentUser.email.trim().toLowerCase();
    return allFav[email] || [];
}

function favoriteStore(promptId){
    if(!currentUser || !currentUser.email)return {};
    let allFav=toGetallFavorites();
    let email=currentUser.email.trim().toLowerCase();
    if(!allFav[email]){
        allFav[email]=[]
    }
    let userFavorites=allFav[email];
    let prompt=prompts.find(p=>p.id==promptId);
    if (!prompt)return;
    
    let index=userFavorites.findIndex(p=>p.id==promptId);
    if(index !== -1){
        userFavorites.splice(index,1);
        localStorage.setItem("proitz-fav",JSON.stringify(allFav));
        return false;
    }
    else{
        userFavorites.push(prompt);
        localStorage.setItem("proitz-fav",JSON.stringify(allFav));
        return true;
    }
    

}

document.addEventListener("click", function(event) {
    let button = event.target.closest('[data-action="favorite"]');
    if (!button) return;
    let card = button.closest(".prompt-card");
    if (!card) return;
    let result = favoriteStore(card.dataset.id);
    if (result===true){
        button.innerHTML=`<i class="fa-solid fa-heart"></i>`
        button.classList.add("favorited");
        showToast("Prompt added to favorites");

    }
    else if(result===false){
        button.innerHTML=`<i class="fa-regular fa-heart"></i>`
        button.classList.remove("favorited");
        showToast("Prompt removed from favorites");
    }
});


document.addEventListener("click",ele=>{
    let clickedButton=ele.target.closest("[data-cat]")
    if(clickedButton){
        activeCategory = clickedButton.dataset.cat;
        render();
        return;
    }
})

searchInput=document.querySelector(".main-search")
searchInput.addEventListener("input",()=>{
    searchText=searchInput.value;
    promptDivision();
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






document.addEventListener("click", function(event) {
    let button = event.target.closest('[data-action="like"]');
    if (!button) return;
    if (!currentUser) return;
    let card = button.closest(".prompt-card");
    if (!card) return;
    let promptId=card.dataset.id;
    let userId = currentUser.id || currentUser.name || "";
    if (!userId) return;
    let items=getMyRepo();
    let prompt=items.find(p=>String(p.id)===String(promptId));
    if (!prompt) return;
    let publicItems = toGetPublic();
    let publicPrompt = publicItems.find(p=> String(p.id)==String(promptId));
    if(!prompt.public || !publicPrompt)return;

    if (!Array.isArray(publicPrompt.likes)) {
        publicPrompt.likes = [];
    }
    let alreadyLiked =publicPrompt.likes.some(id=> String(id)===userId);
    if(alreadyLiked){
        publicPrompt.likes=publicPrompt.likes.filter(
            id=> String(id) !== userId
        );
    }else {
       publicPrompt.likes.push(userId);
    }

    prompt.likes=[...publicPrompt.likes];
    saveMyRepo(items);
    toSavePublic(publicItems);
    render();
});

document.addEventListener("click",(event)=>{
    let button =event.target.closest("[data-action='post']");
    if(!button)return;
    let card=button.closest(".prompt-card");
    let promptId =card.dataset.id;

    let items =getMyRepo();
    let prompt=items.find(p=>p.id === promptId);
    if(!prompt) return;
    let publicItems=toGetPublic(); 
    let exists =publicItems.some(p=> p.id === promptId);
    let message="";
    if(exists){
        publicItems = publicItems.filter(p => p.id !== promptId);
        prompt.public = false;
        message="Prompt removed from public"
    }
    else{
        prompt.public=true;
        publicItems.unshift({
            ...prompt,
            likes:[...(prompt.likes || [])]
        });
        message="prompt successfully posted";
    }
    if (!saveMyRepo(items)){
        showToast("could not update My repo")
        return;
    }
    toSavePublic(publicItems);
    render();
    showToast(message);
});









let searchBar=document.querySelector(".main-search");
let isFocused=false;

document.addEventListener("keydown",(event)=>{
    console.log(event.key);
    if(event.key=='/'){
        console.log(searchBar.value);
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


render();

if(window.location.search=="?vasa=10"){
    openForm();
}

let pending=localStorage.getItem("pendingRepoPrompt");
if(pending){
    document.getElementById("repo-text").value=pending;
    document.getElementById("repo-category").value="AI Generated";
    localStorage.removeItem("pendingRepoPrompt")
}

showUser();

document.getElementById("add").addEventListener("click", openForm);
document.getElementById("cancel-prompt").addEventListener("click", ()=>{
    editingPromptId = null;
    document.getElementById("repo-text").value = "";
    document.getElementById("repo-category").value = "";
    savePrompts.textContent = "Save Prompt";
    closeForm();
});