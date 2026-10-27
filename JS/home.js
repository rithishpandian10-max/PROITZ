function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) {
        window.location.replace("index.html");
    }
}
checkLogin();
window.addEventListener("pageshow", checkLogin);
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

const systemPrompts = [
    { category: "Coding", text: "Write a production-ready Python program using asynchronous programming to concurrently scrape multiple web pages, parse their HTML structures using BeautifulSoup, handle network exceptions gracefully, and store the extracted data into a structured SQLite database." },
    { category: "Coding", text: "Perform a thorough security and performance code review on this JavaScript snippet. Identify potential memory leaks, asynchronous race conditions, unhandled promise rejections, and refactor the code using modern ES6+ syntax for optimal execution." },
    { category: "Coding", text: "Design a fully responsive, mobile-first pricing table component using pure HTML and Tailwind CSS. Include hover animation effects, a toggle switch for monthly versus annual billing with a highlighted 'Save 20%' badge, and ensure accessibility compliance." },
    { category: "Coding", text: "Write a robust SQL query using window functions and common table expressions (CTEs) to analyze monthly user retention rates, calculate rolling 30-day active user averages, and identify top-performing revenue tiers from an e-commerce transactions table." },
    { category: "Coding", text: "Explain the underlying architectural mechanics of how React's virtual DOM reconciliation algorithm works under the hood, detailing fiber nodes, the render and commit phases, and how keys optimize list re-rendering performance." },
    { category: "Coding", text: "Build a comprehensive unit testing suite using Jest for a complex shopping cart module. Cover edge cases like discount code stacking, invalid quantity updates, currency conversion failures, and stock availability checks with mocked API responses." },
    { category: "Coding", text: "Develop a Node.js Express middleware function that implements rate limiting using Redis, tracks client IP addresses, returns standard 429 HTTP status codes with retry headers, and logs security incidents to a central monitoring service." },
    { category: "Coding", text: "Write a clean TypeScript interface and implementation for a generic State Management store based on the Publisher-Subscriber pattern, supporting undo/redo action histories and immutable state updates." },
    { category: "Coding", text: "Create a Dockerfile and docker-compose setup for a full-stack web application consisting of a React frontend, a FastAPI backend server, a PostgreSQL database, and an Nginx reverse proxy with SSL certificate configurations." },
    { category: "Coding", text: "Implement a custom WebGL shader using Three.js to render an interactive 3D metallic sphere that reacts dynamically to ambient audio frequencies, producing smooth ripple deformation effects across its mesh surface." },
    { category: "Story", text: "Write an atmospheric, slow-burn psychological sci-fi story about a deep-space archivist who discovers a data cassette containing voice logs recorded by their own voice, detailing events that will not happen for another three hundred years." },
    { category: "Story", text: "Craft a rich fantasy narrative set in a steampunk city powered entirely by captured starlight, where an artisan glassblower accidentally traps a dying constellation inside a chandelier, causing the entire district's gravity to distort." },
    { category: "Story", text: "Tell a suspenseful mystery tale about a cartographer who notices that a secluded, mountainous village has completely vanished from every physical map printed after 1984, yet locals continue to send mail stamped with yesterday's date." },
    { category: "Story", text: "Write an emotional slice-of-life story about an aging clockmaker who repairs an antique pocket watch left by a stranger, only to realize that every time he winds it backward, he can alter a single minor regret from his past." },
    { category: "Story", text: "Develop a gritty cyberpunk noir scene where a private investigator specializing in stolen digital dreams uncovers a conspiracy involving a rogue corporate AI that is slowly overwriting human memories with nostalgic black-and-white silent films." },
    { category: "Story", text: "Compose a mythic folklore tale about an ancient forest where shadows refuse to follow their owners after sundown, gathering in the clearing to whisper forgotten secrets of the kingdom to anyone brave enough to listen." },
    { category: "Story", text: "Draft an immersive horror opening set inside a Victorian lighthouse during an unnatural fog, where the lightkeeper discovers that the ocean waves have stopped moving entirely, locking the ship fleet into frozen dark water." },
    { category: "Story", text: "Write a whimsical urban fantasy chapter about a secret library hidden beneath a crowded subway station, where forgotten book characters wander the aisles looking for readers who still remember their stories." },
    { category: "Story", text: "Create an intricate post-apocalyptic narrative following a botanist who travels through a abandoned neon metropolis to cultivate the world's last surviving flowering cherry blossom tree inside a ruined skyscraper." },
    { category: "Story", text: "Craft a gripping courtroom thriller scene set in a futuristic society where trial verdicts are decided by an impartial Quantum Predictor algorithm, until a defense attorney finds a human bias hardcoded into its core training set." },
    { category: "Image", text: "A cinematic wide-angle shot of an ancient, overgrown cathedral interior where massive glowing bioluminescent flora intertwine with shattered stained-glass windows, as soft misty sunlight beams down on a lone wanderer." },
    { category: "Image", text: "A highly detailed cyberpunk street market in New Tokyo during a heavy neon-drenched downpour, featuring reflections of giant holographic koi fish swimming through the air between towering futuristic skyscrapers." },
    { category: "Image", text: "An ethereal fantasy landscape showing a floating steampunk harbor city built upon the shell of an ancient, slumbering sky-whale, adorned with brass airships docked along cloud-shrouded wooden piers at golden hour sunset." },
    { category: "Image", text: "A moody, hyper-realistic macro photograph of a mechanical dragonfly constructed from polished copper gears and sapphire crystals, resting gently on the damp petal of an exotic dark purple lotus flower." },
    { category: "Image", text: "An epic high-fantasy battle scene on a snowy mountain ridge during a blizzard, featuring a knight in ornate silver armor locking swords with an ancient frost dragon whose scales shimmer with iridescent blue ice." },
    { category: "Image", text: "A cozy, hyper-detailed interior of a wizard's cluttered study overflowing with floating spellbooks, bubbling potion vials glowing in neon hues, and a sleepy owl perched beside a frosty window overlooking an enchanted forest." },
    { category: "Image", text: "A surreal surrealist oil painting of an hourglass sitting on a endless salt flat, where the sand falling inside turns into flocking white birds that fly upward through a rift in the starry night sky." },
    { category: "Image", text: "A vibrant retro 80s synthwave poster featuring a sleek sports car driving down a grid highway toward a giant digital sun setting over a misty purple horizon surrounded by low-poly wireframe mountains." },
    { category: "Image", text: "An isometric 3D render of a tiny cozy cafe built inside a hollowed-out oak tree stump, complete with glowing fairy lights, tiny wooden tables, and warm steam rising from ceramic coffee cups." },
    { category: "Image", text: "A dramatic wildlife portrait of an majestic Arctic wolf standing atop a frosted glacial peak under the shimmering green ribbons of the Aurora Borealis, shot on 35mm cinematic film stock." },
    { category: "Entertainment", text: "Write a dramatic, Oscar-worthy screenplay scene where two office workers engage in an intense, high-stakes negotiation over who gets to take the very last slice of pepperoni pizza left in the communal breakroom fridge." },
    { category: "Entertainment", text: "Invent a bizarre, wildly over-engineered sci-fi board game played across three dimensions, detailing its absurd rulebook, winning conditions involving interdimensional bankruptcy, and components made of magnetic plasma." },
    { category: "Entertainment", text: "Describe a satirical nature documentary script observing the elusive corporate 'Zoom Meeting Mutant' species—focusing on their natural habitats, mute-button survival tactics, and the ritualistic closing phrase 'Can everyone see my screen?'" },
    { category: "Entertainment", text: "Compose a multi-line joke where each consecutive line escalates the situation absurdly, starting from a minor inconvenience at a coffee shop and ending with accidental international diplomacy negotiations on Mars." },
    { category: "Entertainment", text: "Write a passionate, overly dramatic restaurant review for a bowl of instant ramen written as if it were a Michelin-starred culinary masterpiece discovered during a perilous expedition across the kitchen counter." },
    { category: "Entertainment", text: "Create a fictional conspiracy theory podcast transcript where the host connects household toaster timers to ancient interstellar communication networks, explaining why your toast always pops up one second too late." },
    { category: "Entertainment", text: "Write an amusing stand-up comedy monologue dissecting the strange psychology of smart home assistants, unread email notifications, and the perpetual cycle of forgetting passwords every three weeks." },
    { category: "Entertainment", text: "Draft a hilarious pitch for a reality TV competition show where master chefs are forced to cook five-star gourmet meals using only ingredients found inside gas station vending machines and convenience store aisles." },
    { category: "Entertainment", text: "Create a series of theatrical character monologues from the perspective of an smartphone battery sitting at 1% charge, pleading dramatically with its owner to be plugged into a wall outlet immediately." },
    { category: "Entertainment", text: "Write a humorous fantasy role-playing game quest guide where the main objective is convincing a stubborn dragon to vacate a cavern because a city development firm wants to build luxury condominiums there." },
    { category: "Productivity", text: "Design a comprehensive, highly rigorous 4-week intensive study curriculum and revision timetable for professional certification exams, incorporating active recall techniques, Pomodoro intervals, and spaced repetition schedules." },
    { category: "Productivity", text: "Analyze this lengthy, unstructured research transcript and synthesize the core findings into an executive summary featuring five high-impact bullet points, actionable next steps, and a prioritized risk assessment matrix." },
    { category: "Productivity", text: "Transform these raw, messy brainstorming session notes into a structured, prioritized project action list using the Eisenhower Matrix method, complete with estimated timelines, resource allocations, and milestone checkpoints." },
    { category: "Productivity", text: "Develop a holistic personal weekly time-audit template and schedule optimization guide designed to eliminate burnout, balance deep-work sprints, minimize context-switching, and carve out dedicated blocks for physical health." },
    { category: "Productivity", text: "Create a step-by-step Standard Operating Procedure (SOP) document for onboarding remote software engineers, detailing tool provisioning, security compliance checklists, repository access steps, and first-week milestone goals." },
    { category: "Productivity", text: "Formulate a strategic quarterly growth plan for a bootstrapped SaaS startup, outlining key performance indicators (KPIs), customer acquisition channels, target churn reduction targets, and agile sprint milestones." },
    { category: "Productivity", text: "Write a persuasive, structured cold email sequence designed to reach C-level enterprise executives, focusing on pain point identification, value proposition presentation, and a low-friction call-to-action." },
    { category: "Productivity", text: "Draft a comprehensive project post-mortem template that guides teams through evaluating project wins, root-cause analyses of delays, budget variances, and key actionable lessons for future development sprints." },
    { category: "Productivity", text: "Construct a complete content calendar framework for a tech product launch across LinkedIn, Twitter, and email newsletters, detailing daily post themes, visual asset requirements, and engagement metrics." },
    { category: "Productivity", text: "Outline an effective negotiation preparation checklist for software engineers discussing salary increases, detailing market rate research steps, impact portfolio presentation tips, and counter-offer strategies." }
];


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


// profile section
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



















let addButton=document.getElementById("add");
function toGetallFavorites(){
    return JSON.parse(localStorage.getItem("proitz-fav")) || {};
}


function showUser() {
    if (!currentUser) {
        window.location.replace("index.html");
        return;
    }

    const firstName = currentUser.name.split(" ")[0];
    const initial = document.getElementById("initial");
    const greeting = document.querySelector(".main-section > p");

    initial.textContent = currentUser.name.charAt(0).toUpperCase();
    greeting.textContent = "Hi " + firstName + "! Search, save and share prompts for every AI tool you use.";
}






const key="proitzDefault";

function getPrompts(){
    return JSON.parse(localStorage.getItem(key)) || [];
}
function savePrompts(list){
    localStorage.setItem(key,JSON.stringify(list));
}
function defaultLoad(){
    if(localStorage.getItem(key)) return;

    let list=systemPrompts.map((item,index)=>({
        id: "d-"+index,
        text: item.text,
        category: item.category,
        author: "PROITZ",
        public: true,
        likes:[]
    }));
    savePrompts(list);
}









let prompts=[];
let activeCategory="All";
let searchText="";

function renderCategories(){
    let categoryName=["All",...new Set(prompts.map(p=>p.category))];
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
      <button class="copy" data-action="copy">Copy prompt</button>
      <button class="add-favorite glass-effect ${toGetFavorites().some(f => String(f.id) === String(prom.id))? 'favorited' : ''}"data-action="favorite">${toGetFavorites().some(f => String(f.id) === String(prom.id)) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}</button>
    <div class="like-section">
        <img src="${(prom.likes || []).includes(currentUser ? (currentUser.id || currentUser.name) : null) ? '../images/Translucent Gradient Glass Heart.png' : '../images/Minimal Black Heart Outline.png'}" alt="Like" class="like-btn" data-action="like">
        <span class="like-count">+${(prom.likes || []).length}</span>
    </div>
    </div>`

    ).join("");
}

let promptModal=document.getElementById("prompt-modal");
let closeModal=document.getElementById("close-modal");
let categoryDetail=document.getElementById("detail-category");
let detailTitle=document.getElementById("detail-title");
const detailAuthor = document.getElementById("detail-author");
const detailText = document.getElementById("detail-text");
function openPromptDetails(prompt){
    categoryDetail.textContent=prompt.category||"general";
    detailAuthor.textContent=`By ${prompt.author || "unknown"}`;
    detailText.textContent=prompt.text||"";
    promptModal.style.display="flex";
    document.body.style.overflow="hidden";
}
function closePromptDetails(){
    promptModal.style.display="none";
    document.body.style.overflow="auto"
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







// function toggleFavorite(promptId) {
//     let favorites = JSON.parse(localStorage.getItem("proitzFavorites")) || [];
//     let prompt = prompts.find(p => p.id === promptId);
//     if (!prompt) return;
//     let index = favorites.findIndex(p => p.id === promptId);
//     if (index !== -1) {
//         favorites.splice(index, 1);
//     } else {
//         favorites.push(prompt);
//     }
//     localStorage.setItem("proitzFavorites", JSON.stringify(favorites));
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
searchInput.addEventListener("input",ele=>{
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
    let prompt = prompts.find(p => p.id === card.dataset.id);
    if (!prompt) return;
    let userId = currentUser.id || currentUser.name;
    if (!userId) return;
    if (!Array.isArray(prompt.likes)) prompt.likes = [];
    if (prompt.likes.includes(userId)) {
    prompt.likes = prompt.likes.filter(id => id !== userId);
    } else {
    prompt.likes.push(userId);
    }
savePrompts(prompts);
promptDivision();
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

const logoutBtn = document.getElementById("logout-profile");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.replace("index.html");
    });
}



defaultLoad()
prompts=getPrompts();
renderCategories();
render();
showUser();

