let recordCount : number ,startIndex : number , endIndex : number ; 
let columnHeaders : any [];
let resizeTimer: number;

window.onload =  () => GetRecordCount();

//Calculating how many records to display based on widow size
function calRowPerView(){
    return Math.floor((window.innerHeight - 250 )/ 70); 
}

function loadGrid(start: number){
    startIndex = start;
    endIndex = start + calRowPerView();
    
    //adding heading to the page header
    document.getElementById("tableHeading").innerHTML = 'Onboarding Project Data Grid';
    //clearing current table
    document.getElementById("divTable").innerHTML = '';
    //calling Records
    GetRecords(startIndex ,endIndex); 

}

function GetRecordCount(){
    //calling record count from the api, full url http://localhost:2050/recordcount
    $.get("/recordCount", function(numberRecords){
        recordCount = numberRecords;
        GetColumnHeaders(); 
     }).fail(function(){
         alert("Error while calling Record Count")
     });
}

function GetColumnHeaders(){
    //calling column header from the api, full url http://localhost:2050/columns 
    $.get("/columns", function(headers){
        columnHeaders = JSON.parse(headers);
        loadGrid(0);
    }).fail(function(){
        alert("Error while calling column header")
    });
}

function GetRecords(start: number , end: number ){
    //calling records from the api, full url http://localhost:2050/records?from=1&to=3
    $.get("/records?from="+ start + "&to=" + end, function(rec){
       //creating table grid with records returned by the api
        createTable(JSON.parse(rec));
       }).fail(function(){
           alert("Error while calling records")
       });
}

//building table 
function createTable(records: any[]){
    let table = document.createElement("table");
    let tableBody = document.createElement("tbody");
    let tableHead = document.createElement("thead");
    
    //creating table columns 
    for (let c = 0 ; c < columnHeaders.length; c++){
        tableHead.appendChild(document.createElement("th"))
                 .appendChild(document.createTextNode(columnHeaders[c]));
    }
    table.appendChild(tableHead);

    //creating table rows
    for (let a = 0 ; a < records.length; a++){
        let tableRow = document.createElement("tr");
        table.appendChild(tableRow);

        let tdArray = records[a].length;

        for (let b = 0; b < tdArray; b++){
         tableRow.appendChild(document.createElement("td"))
         .appendChild(document.createTextNode(records[a][b]));   
        }
    }
    //Adding table to table div ID = divTable 
    document.getElementById("divTable").appendChild(table)
    //Adding buttons to to the footer tag
    document.getElementById("footer").innerHTML = '<button onclick="BackButton()">Back</button> <button onclick="NextButton()">Next</button>';
}

//Next button function
function NextButton(){
    if (endIndex < recordCount ) {
       loadGrid(endIndex + 1)
    }
}

//back button function
function BackButton(){
    startIndex -= calRowPerView(); 
    loadGrid(startIndex - 1);    
}

//update table gride size based on current window size
window.onresize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function (){  
        calRowPerView();
        loadGrid(startIndex);
    },200);
}