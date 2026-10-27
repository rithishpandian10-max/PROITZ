function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) {
        window.location.replace("index.html");
    }
}
checkLogin();
window.addEventListener("pageshow", checkLogin);
let currentUser = JSON.parse(localStorage.getItem("currentUser"));


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



// calculation

function updateUi(inputTokens,outputToken,inputCost,outputCost,totalCost){
    let summarySection=document.querySelectorAll(".token-summary h2");
    summarySection[0].textContent=inputTokens;
    summarySection[1].textContent=outputToken;
    let totalElement = document.querySelector(".total-tokens h2");
    totalElement.textContent=inputTokens+outputToken;
    let mainCost=document.querySelector(".cost-title h2");
    mainCost.textContent=totalCost;
    let sepCost=document.querySelectorAll(".cost p");

    sepCost[0].textContent="Input Cost :"+inputCost.toFixed(6);
    sepCost[1].textContent="Output Cost :"+outputCost.toFixed(6);
}






const logoutBtn = document.getElementById("logout-profile");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.replace("index.html");
    });
}


document.addEventListener("DOMContentLoaded",()=>{
    if (!currentUser) {
        window.location.replace("index.html");
        return;
    }
})



let calcBtn=document.getElementById("calc-tokens");
const modelPricing = {
    'gpt-4o': { input: 0.0025, output: 0.0100 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4.1': { input: 0.0025, output: 0.0100 },       
    'gpt-4.1-mini': { input: 0.00015, output: 0.0006 },  
    'claude': { input: 0.0030, output: 0.0150 },        
    'gemini': { input: 0.00125, output: 0.00375 }       
};
const outputLength={
    'default':2.0,
    'short':0.15,
    'medium':0.75,
    'long':3.5,
}

function calculateInputTokens(text){
    if(!text.trim())return;
    let wordCount=text.trim().split(/\s+/).length;
    let charCount=text.length;
    let tokenWords=wordCount/0.75;
    let tokenChar=charCount/4;
    let totToken=(tokenWords+tokenChar)/2;
    return totToken>1 ? Math.round(totToken):1;
}

function dataLoad(){
    let promptText=document.getElementById("user-prompt").value;
    if(!promptText){
        return
    }
    let selectedModel=document.getElementById("modelSelect").value;
    let selectedLength=document.getElementById("responseLength").value;

    let inputTokens=calculateInputTokens(promptText);
    let multiplier=outputLength[selectedLength] || 2.0;
    let outputToken=Math.round(inputTokens*multiplier);

    let rate= modelPricing[selectedModel]||modelPricing["gpt-4o"];
    let inputCost=(inputTokens/1000)*rate.input;
    let outputCost=(outputToken/1000)*rate.output;
    let totalCost=(inputCost+outputCost).toFixed(6);
    console.log(inputTokens,outputToken,inputCost,outputCost,totalCost)
    updateUi(inputTokens,outputToken,inputCost,outputCost,totalCost);
}


document.getElementById("modelSelect").addEventListener("change",dataLoad);
document.getElementById("responseLength").addEventListener("change",dataLoad);
calcBtn.addEventListener("click",dataLoad);

let toolButtons=document.querySelectorAll(".tool-button");
let toolGrid= document.querySelector(".tools-grid");
let mainSection =document.querySelector(".main-section");
let navbar= document.querySelector(".navbar");
let calculator = document.querySelector(".calc-section");
let generator =document.querySelector(".prompt-generator");
let backBtn=document.getElementById("backBtn");

backBtn.addEventListener("click",()=>{
    calculator.classList.remove("active")
    generator.classList.remove("active");
    if(toolGrid)toolGrid.style.display="grid";
    if(mainSection)mainSection.style.display="flex";
    backBtn.style.display="none";
    window.location.hash="";
})

toolButtons.forEach(button =>{
    button.addEventListener("click", event =>{
        event.preventDefault();
        let target=button.getAttribute("href");
        if(toolGrid)toolGrid.style.display="none";
        backBtn.style.display ="inline-block"
        calculator.classList.remove("active");
        generator.classList.remove("active");
        mainSection.style.display="none"
        if (target === "#token-calculator") {
            calculator.classList.add("active");
        } else if (target === "#prompt-generator") {
            generator.classList.add("active");
        }
    });
    if(calcBtn){
        calcBtn.addEventListener("click",dataLoad);
    }
})


function showUser() {
    if (!currentUser) {
        window.location.replace("index.html");
        return;
    }

    const initial = document.getElementById("initial");
    initial.textContent = currentUser.name.charAt(0).toUpperCase();
}
showUser();







document.addEventListener("DOMContentLoaded",()=>{
    let idea =document.getElementById("prompt-idea");
    let style=document.getElementById("prompt-style");
    let extra=document.getElementById("prompt-extra");

    let generateBtn=document.getElementById("generate-prompt-btn");
    const copyBtn = document.getElementById("copy-prompt-btn");
    const clearBtn = document.getElementById("clear-prompt-btn");
    const result = document.getElementById("generated-prompt-result");
    const status = document.getElementById("prompt-status");

    let addToRepoBtn=document.getElementById("add-to-repo-btn");

    addToRepoBtn.addEventListener("click",()=>{
        let promptText=result.value.trim();
        if(!promptText){
            status.textContent="Generate Prompt first";
            return;
        }
        console.log(promptText);
        localStorage.setItem("pendingRepoPrompt",promptText);
        window.location.href="myrepo.html?vasa=10";
    })



    const apiKey= "AQ.Ab8RN6IhH1JpjlBkf4nDnz9XOuJ9-FRI5FQwgcI2nuYXalkiVA";
    const MODEL="gemini-3.5-flash-lite";
    const URL= `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    let isGenerating = false;
    let controller = null;

    generateBtn.addEventListener("click", generatePrompt);
    copyBtn.addEventListener("click", copyPrompt);
    clearBtn.addEventListener("click", clearPrompt);

    async function generatePrompt(){
        if(isGenerating)return;
        const userIdea = idea.value.trim();
        const userStyle = style.value.trim();
        const userExtra = extra.value.trim();

        if(!userIdea){
            status.textContent="Please enter your prompt idea.";
            idea.focus();
            return;
        }
        if(!apiKey){
            status.textContent="please Add your gemini Api key in script";
            return;
        }
        isGenerating=true;
        controller = new AbortController();
        let timeoutId=setTimeout(()=>{
            controller?.abort();
        },90000);
        generateBtn.disabled = true;
        generateBtn.textContent = "Generating...";
        copyBtn.disabled = true;
        result.value = "";

        status.textContent="Creating your detailed prompt...";

        try{
            const response =await fetch(URL,{
                method:"POST",
                headers:{
                    "content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents:[
                        {
                            role: "user",
                            parts:[{
                                text: `Act as an expert AI prompt engineer.

Rewrite the idea below into a detailed, high-quality AI prompt.

Requirements:
-give it to me plain text.
-dont use markdown.
-dont assume extra prompt important that's not important.
-your are only need to here to generate prompt.
-only give prompt in the output.
- Preserve the original intention.
- Add relevant details, constraints, and output format.
- Follow the requested style.
- Be specific and avoid repetition.
- Return only the improved prompt.

IDEA: ${userIdea}
STYLE: ${userStyle || "Professional"}
EXTRA: ${userExtra || "None"}`
                            }
                           ]
                        }
                    ],
                    generationConfig:{
                        temperature:0.3,
                        maxOutputTokens:700
                    }
                }),
                signal: controller.signal
            });
            const rawResponse=await response.text();
            let data;
            try{
                data=JSON.parse(rawResponse);
            }
            catch{
                throw new Error(`invalid API response (HTTP ${response.status}).`);
            }
            if(!response.ok){
                throw new Error(data.error?.message || `Gemini API error: HTTP ${response.status}`);
            }
            const candidate=data.candidates?.[0];
            const improvedPrompt = candidate?.content?.parts?.map(part => part.text || "").join("").trim();
            if(!improvedPrompt){
                let reason =candidate?.finishReason || "No output";
                throw new Error(`Gemini returned no text. Reason: ${reason}`);
            }

            result.value=improvedPrompt;
            status.textContent="Prompte generated...";
        }catch (error){
            console.log("Gemini API error:",error);
            if(error.name ==="AbortError"){
                status.textContent="Request took over 90 seconds. Check your connection, API quota, and API status.";
            }
            else if(error instanceof TypeError){
                status.textContent="Network error. Check your internet connection and browser console.";
            }
            else{
                status.textContent=`Error: ${error.message}`;
            }
        }finally{
            clearTimeout(timeoutId);
            controller = null;
            isGenerating = false;

            generateBtn.disabled = false;
            generateBtn.textContent = "Generate Prompt";
            copyBtn.disabled = false;
            }
        }
        async function copyPrompt(){
            if (!result.value.trim()) {
                status.textContent = "Generate a prompt first.";
                 return;
            }
            navigator.clipboard.writeText(result.value);
            status.textContent = "Prompt copied successfully!";
        }
        function clearPrompt(){
            if(isGenerating){
                controller?.abort();
            }
            idea.value="";
            style.value="";
            extra.value="";
            result.value="";
            status.textContent = "Ready for a new prompt.";
            idea.focus();
        }
        [idea, style,extra].forEach(input =>{
            input.addEventListener("keydown",event=>{
                if(event.key==="Enter" && (event.ctrlKey || event.metaKey)){
                    event.preventDefault();
                    generatePrompt();
                }
            });
        });
});









