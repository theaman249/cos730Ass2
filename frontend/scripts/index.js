const id_textAreaOut = document.getElementById("textAreaOut");
const id_lblLoading = document.getElementById("lblLoading");

function clearTextAreaOut(){
    id_textAreaOut.innerHTML = "";
}

function getData(){

    const id_studentDetailsId = document.getElementById("studentDetails_id");
    const id_studentDetailsName = document.getElementById("studentDetails_name");
    const id_studentDetailsSurname = document.getElementById("studentDetails_surname");
    const id_studentDetailsEmail = document.getElementById("studentDetails_email");
    const id_studentDetailsCompany = document.getElementById("studentDetails_company");
    const id_studentDetailsRole = document.getElementById("studentDetails_role");

    let xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:4000/getUserData");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {

                id_lblLoading.innerHTML = "";

                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                id_studentDetailsId.innerHTML = data.id;
                id_studentDetailsName.innerHTML = data.fname;
                id_studentDetailsSurname.innerHTML = data.lname;
                id_studentDetailsEmail.innerHTML = data.email;
                id_studentDetailsCompany.innerHTML = data.company;
                id_studentDetailsRole.innerHTML = data.role;   
            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert(jsonResponse);
            }

        }
    };

    xhr.send();
}

function getMomentumETFs(){
    const resultCount = Number(document.getElementById("inNumResults").value);

    const jsonObj = {
        result_count:resultCount
    }

    const jsonString = JSON.stringify(jsonObj)

    clearTextAreaOut();

    //console.log(jsonString);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:4000/getMomentumETFs");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {

                id_lblLoading.innerHTML = "";

                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                for(let i=0; i<data.length; ++i)
                {
                    id_textAreaOut.innerHTML += `{ticker: ${data[i].ticker}, issuer: ${data[i].issuer}, name: ${data[i].name}, volume: ${data[i].volume}, risk: ${data[i].risk}, YTD: ${data[i].ytd_return}}\n`;
                }
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


function getETFData(){
    const resultCount = Number(document.getElementById("inNumResults").value);
    const id_sortAlphabetically = document.getElementById("chbSortAlphabetically");
    const ticker = document.getElementById("inETFticker").value;
    const volume = document.getElementById("inMinVolume").value;
    let risk = "all"; //default
    
    //get the risk value that was selected

    var riskElement = document.getElementsByName('risk');
    for (i = 0; i < riskElement.length; i++) {
        if (riskElement[i].checked)
            risk = riskElement[i].value;
    }


    let alphabetical = false;
    id_lblLoading.style.color = 'green';
    id_lblLoading.innerHTML = "Fetching Data....."

    //clearTextArea
    clearTextAreaOut();


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
        ticker:ticker,
        min_volume:volume,
        risk:risk
    }

    const jsonString = JSON.stringify(jsonObj)

    //console.log(jsonString);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:4000/getETFData");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {

                id_lblLoading.innerHTML = "";

                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                // console.log(data.length);
                // console.log(data[0]);

                for(let i=0; i<data.length; ++i)
                {
                    id_textAreaOut.innerHTML += `{ticker: ${data[i].ticker}, issuer: ${data[i].issuer}, name: ${data[i].name}, volume: ${data[i].volume}, risk: ${data[i].risk}, YTD: ${data[i].ytd_return}}\n`;
                }
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