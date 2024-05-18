const id_textAreaOut = document.getElementById("textAreaOut");



function clearTextAreaOut(){
    id_textAreaOut.innerHTML = "";
}


function getETFData(){
    const resultCount = document.getElementById("inNumResults").value;

    if(resultCount>100){
        alert("Invalid value for Result count MAX = 100 ");
        return;
    }
    else if(resultCount <= 0){
        alert("Invalid value for Result count > 0 ");
        return;
    }
    
    


}