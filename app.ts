let recordCount: number, startIndex: number, endIndex: number;
let columnHeaders: any[];
let resizeTimer: number;

window.onload = () => getRecordCount();

//calculating how many records to display based on widow size
function calRowPerView() {
  let x = Math.floor((window.innerHeight - 250) / 39);
  if (x < 0) {
    alert("Window screen to small to display records , Resize window");
  }
  return x;
}

function loadGrid(start: number) {
  startIndex = start;
  endIndex = start + calRowPerView();

  if (startIndex < 0) {
    startIndex = 0;
    endIndex = calRowPerView();
  }
  if (endIndex >= recordCount) {
    endIndex = recordCount - 1;
  }
  if (startIndex >= recordCount) {
    startIndex = recordCount - calRowPerView();
  }
  if (
    startIndex >= recordCount - calRowPerView() && startIndex <= recordCount - 1) {
    startIndex = recordCount - (calRowPerView() + 1);
  }
  //creating header and search input field
  document.getElementById("header").innerHTML = `<input type="number" 
    id="search" onfocusout="Search(event)" placeholder="Search : Enter ID">`;

  //clearing current table
  document.getElementById("divTable").innerHTML = "";
    
  // $("table").empty()

  //calling Records
  getRecords(startIndex, endIndex);
}

function getRecordCount() {
  //calling record count from the api, full url http://localhost:2050/recordcount
  $.get("/recordCount", function (numberRecords) {
    recordCount = numberRecords;
    getColumnHeaders();
  }).fail(function () {
    alert("Error while calling Record Count");
  });
}

function getColumnHeaders() {
  //calling column header from the api, full url http://localhost:2050/columns
  $.get("/columns", function (headers) {
    columnHeaders = JSON.parse(headers);
    loadGrid(0);
  }).fail(function () {
    alert("Error while calling column header");
  });
}

function getRecords(start: number, end: number) {
  //calling records from the api, full url http://localhost:2050/records?from=1&to=3
  $.get("/records?from=" + start + "&to=" + end, function (rec) {
    //creating table grid with records returned by the api
    createTable(JSON.parse(rec));
  }).fail(function () {
    alert("Couldn't load records , page will refresh");
  });
}

//building table
function createTable(records: any[]) {
  let table = document.createElement("table");
  // let table = this.$el("table");
  let tableBody = document.createElement("tbody");
  let tableHead = document.createElement("thead");
  //creating table columns
  for (let c = 0; c < columnHeaders.length; c++) {
    tableHead
      .appendChild(document.createElement("th"))
      .appendChild(document.createTextNode(columnHeaders[c]));
  }
  table.appendChild(tableHead);

  //creating table rows
  for (let a = 0; a < records.length; a++) {
    let tableRow = document.createElement("tr");
    table.appendChild(tableRow);

    let tdArray = records[a].length;

    for (let b = 0; b < tdArray; b++) {
      tableRow
        .appendChild(document.createElement("td"))
        .appendChild(document.createTextNode(records[a][b]));

      tableBody.appendChild(tableRow);
    }
  }
  table.appendChild(tableBody);
  //Adding table to table div ID = divTable
  document.getElementById("divTable").appendChild(table);
  //Adding buttons to to the footer tag
  document.getElementById(
    "footer"
  ).innerHTML = `<button onclick="backButton()">Back</button> 
    <button onclick="nextButton()">Next</button>`;
}

function Search(e) {
  let inputValue = (<HTMLInputElement>document.getElementById("search")).value;

  if (inputValue === "") {
    inputValue = startIndex.toString();
    loadGrid(parseInt(inputValue));
  } else {
    loadGrid(parseInt(inputValue));
  }
  // }
}

//next button function
function nextButton() {
  if (endIndex < recordCount - 1) {
    loadGrid(endIndex + 1);
  } else {
    alert("No more records to load");
  }
}

//back button function
function backButton() {
  startIndex -= calRowPerView();
  loadGrid(startIndex - 1);
}

//update table gride size based on current window size
window.onresize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    calRowPerView();
    loadGrid(startIndex);
  }, 200);
};
