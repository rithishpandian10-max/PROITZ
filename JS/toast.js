function showToast(message){
    let container =document.getElementById("toast");
    if(!container)return;
    let toast=document.createElement("div");
    toast.className="toast";
    toast.toastContent=message;
    container.appendChild(toast);
    setTimeout(()=>{
        toast.classList.add("hide");
        setTimeout(()=>toast.remove(),300);
    },3000);
}

