const id_textAreaOut = document.getElementById("textAreaOut");



function clearTextAreaOut(){
    id_textAreaOut.innerHTML = "";
}


function getETFData(){
    const resultCount = Number(document.getElementById("inNumResults").value);
    const id_sortAlphabetically = document.getElementById("chbSortAlphabetically");
    const ticker = document.getElementById("inETFticker").value;
    let alphabetical = false;


    if(resultCount>100){
        alert("Invalid value for Result count MAX = 100 ");
        return;
    }
    else if(resultCount <= 0){
        alert("Invalid value for Result count > 0 ");
        return;
    }

    if(id_sortAlphabetically.checked)
        alphabetical = true;
    else
        alphabetical = false;

    const jsonObj = {
        resultCount:resultCount,
        alphabetical: alphabetical,
        ticker:ticker
    }

    const jsonString = JSON.stringify(jsonObj)

    console.log(jsonString);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:4000/getETFData");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                console.log(data);
            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert(jsonResponse);
            }

        }
    };

    xhr.send(jsonString);
}