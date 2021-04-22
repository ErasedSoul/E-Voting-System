let name = "";
let startTime = "";
let endTime = "";
let candidates = [];
let canString = ""; 

// flushes all inner htmls
function flushAll(){
	document.getElementById("bName").innerHTML = "";
	document.getElementById("bST").innerHTML = "";
	document.getElementById("bET").innerHTML = "";
	document.getElementById("bCans").innerHTML = "";
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    candidates.push(inputValue); 
    canString = canString + inputValue  + ",";
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";
}

function update(){
  // name
  var inputValue = document.getElementById("ballotName").value; //console.log(inputValue); 
  if (inputValue === '') {
    alert("You must write a name!");
  } else {
    name = inputValue; 
    document.getElementById("bName").innerHTML = name;
  }
  // start time
  inputValue = document.getElementById("startTime").value;//console.log(inputValue); 
  if (inputValue === '') {
    alert("You must write start time!");
  } else {
    startTime = inputValue;
    document.getElementById("bST").innerHTML = startTime;
  }
  // end time
  inputValue = document.getElementById("endTime").value; //console.log(inputValue)
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    endTime = inputValue;
    document.getElementById("bET").innerHTML = inputValue;
  }
  // candidate lists
  document.getElementById("bCans").innerHTML = candidates.toString();
}


function setBallot(){
  fetch('./setBallot',
  {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      startTime: startTime,
      endTime: endTime,
      canString: canString,
    })
  })
  .then(function (response) {
    console.log("ballot set!!, page will refresh");
    // flushAll();
    window.location = "http://localhost:4000/ballotCreated";
    // viewBallot();
  })
  .catch(function (error) {
    console.error(error);
  });
}

/*
function viewBallot(){
    let ballotCount; 
    var ballotDetails = $("#ballotDetails");  //document.getElementById("ballotDetails"); //$("#ballotDetails");  //
     ballotDetails.empty();

    fetch('/getBallotCount')
    .then(response => response.json())    // one extra step
    .then(response => {
      console.log("inside viewBallot: ", response);
      document.getElementById("account").innerHTML = response.account;
      ballotCount = response.ballotCount;

    }).then(() => {
        for (var i = 1; i <= ballotCount; i++) { 
            fetch('./ballot_i',
            {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: i,
              })
            }).then(response => response.json()) 
            .then(function (response) {
              // console.log("response from post/ballot_i", response.name);
              var ballotRow = "<tr><th>" + response.id + 
                          "</th><td>" + response.name + 
                          "</td><td>" + response.startTime + 
                          "</th><td>" + response.endTime +
                          "</th><td>" + response.canCount + "</td></tr>"

              ballotDetails.append(ballotRow);
            })
            .catch(function (error) {
              console.error(error);
            });
        }
    })
    .catch(error => console.error(error));
    
}

viewBallot();
*/