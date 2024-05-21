const id_textAreaOut = document.getElementById("textAreaOut");
const id_lblLoading = document.getElementById("lblLoading");

function clearTextAreaOut(){
    id_textAreaOut.innerHTML = "";
}

function tester(){
    return "Obama";
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


function getESGData(){
    const id_sortAlphabetically = document.getElementById("chbSortAlphabetically_esg");
    const id_textAreaOutESG = document.getElementById("textAreaOut_esg");
    const id_chbDowJones = document.getElementById("chbDowJones");
    const id_chbMSCI = document.getElementById("chbMSCI");
    const id_chbSPG = document.getElementById("chbSPG");
    const id_lblLoading = document.getElementById("lblLoading_esg")

    const ticker = document.getElementById("inESGticker").value;
    const resultCount = Number(document.getElementById("inNumResults_esg").value);

    let agencies = [];
    let rating = "all"; //default
    let alphabetical = false;

    var ratingsElement = document.getElementsByName('esgRating');
    for (i = 0; i < ratingsElement.length; i++) {
        if (ratingsElement[i].checked)
            rating = ratingsElement[i].value;
    }

    if(id_chbDowJones.checked){
        agencies.push('dow jones');
    }
    
    if(id_chbMSCI.checked){
        agencies.push('msci');
    }

    if(id_chbSPG.checked){
        agencies.push('s&p');
    }

    if(id_sortAlphabetically.checked)
        alphabetical = true;
    else 
        alphabetical = false;

    id_lblLoading.style.color = 'green';
    id_lblLoading.innerHTML = "Fetching Data....."

    //clearTextArea
    id_textAreaOutESG.innerHTML = "";

    if(resultCount>100){
        alert("Invalid value for Result count MAX = 100 ");
        return;
    }
    else if(resultCount <= 0){
        alert("Invalid value for Result count > 0 ");
        return;
    }

    const jsonObj = {
        result_count: resultCount,
        alphabetical:alphabetical,
        ticker:ticker,
        rating: rating,
        agencies: agencies
    }

    const jsonString = JSON.stringify(jsonObj)

    //console.log(jsonString);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:4000/getESGData");
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
                    id_textAreaOutESG.innerHTML += `{ticker: ${data[i].ticker}, name: ${data[i].name}, rating: ${data[i].rating}, agency: ${data[i].agency}}\n`;
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


    if(resultCount>200){
        alert("Invalid value for Result count MAX = 200");
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

function getSentimentData(){
    const id_sortAlphabetically = document.getElementById("chbSortAlphabetically_sentiment");
    const id_textAreaOutSentiment = document.getElementById("textAreaOut_sentiment");
    const id_chbHold = document.getElementById("chbHold");
    const id_chbBuy = document.getElementById("chbBuy");
    const id_chbSell = document.getElementById("chbSell");
    const id_lblLoading = document.getElementById("lblLoading_sentiment")

    const ticker = document.getElementById("inSentimentTicker").value;
    const resultCount = Number(document.getElementById("inNumResults_sentiment").value);

    let sentiments = [];
    let alphabetical = false;

    if(id_chbBuy.checked){
        sentiments.push('buy');
    }

    if(id_chbHold.checked){
        sentiments.push('hold');
    }

    if(id_chbSell.checked){
        sentiments.push('sell');
    }

    if(id_sortAlphabetically.checked)
        alphabetical = true;
    else 
        alphabetical = false;

    id_textAreaOutSentiment.innerHTML = "";

    id_lblLoading.style.color = 'green';
    id_lblLoading.innerHTML = "Fetching Data.....";

    if(resultCount>150){
        alert("Invalid value for Result count MAX = 150 ");
        return;
    }
    else if(resultCount <= 0){
        alert("Invalid value for Result count > 0 ");
        return;
    }

    const jsonObj = {
        result_count: resultCount,
        alphabetical:alphabetical,
        ticker:ticker,
        sentiments:sentiments
    }

    const jsonString = JSON.stringify(jsonObj)

    //console.log(jsonString);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:4000/getSentimentData");
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
                    id_textAreaOutSentiment.innerHTML += `{ticker: ${data[i].ticker}, name: ${data[i].name}, sentiment: ${data[i].sentiment}}\n`;
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