// global variables 
let canArray = [];
let voteArray = []; 
let bgColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
    ];
let brColor=  [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
    ]; 

/*******************************************************************/

// funtion for tab in the canvas 
function openChart(evt, chartName) {
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  let tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(chartName).style.display = "block";
  evt.currentTarget.className += " active";
}

// funtion for painting in canvas 
function viewChart() {
    // document.querySelector("#chartReport").innerHTML = '<canvas id="myChart"></canvas>';
    let ctx1 = document.getElementById('Bar').getContext('2d');
    let myChart1 = new Chart(ctx1, {
        data: {
            labels: canArray, // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
            {
                type: 'bar',
                label: '# bar view',
                data: voteArray, // [12, 19, 3, 5, 2, 3],
                backgroundColor:  bgColor, 
                borderColor: brColor,
                borderWidth: 2
            },
            {
                type: 'line',
                label: '# line view',
                data: voteArray, // [12, 19, 3, 5, 2, 3],
                backgroundColor:  bgColor, 
                borderColor: brColor,
                borderWidth: 2
            } ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    let ctx2 = document.getElementById('Doughnut').getContext('2d');
    let myChart2 = new Chart(ctx2, {
        data: {
            labels: canArray, // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                type: 'doughnut',
                label: '# doughnut view',
                data: voteArray, // [12, 19, 3, 5, 2, 3],
                backgroundColor:  bgColor, 
                borderColor: brColor,
                hoverOffset: 4, 
                borderWidth: 2
            }] 
        },
        options: {
            plugins: {
                legend: {
                   display: false //This will do the task
                }
            }
        }

    });

    let ctx3 = document.getElementById('Polar').getContext('2d');
    let myChart3 = new Chart(ctx3, {
        type: 'polarArea',
        data: {
            labels: canArray, // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{  
                label: '# polarArea view',
                data: voteArray, // [12, 19, 3, 5, 2, 3],
                backgroundColor:  bgColor, 
                borderColor: brColor,
                borderWidth: 2,
            }]
        },
        options: {
            plugins: {
                legend: {
                   display: false //This will do the task
                }
            }
        }

    });

}

/************************end of canvas ****************************/

// convert utcSecond to date
function date(utcSeconds){
    // let utcSeconds = 1234567890;
    let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    return d;
}

// function for voter already casted vote or not
function votedORnot(){
    fetch('/votedORnot',{
      withCredentials: true,
      credentials: 'include'
    })
    .then(response => response.json())    // one extra step
    .then(response => {
      // console.log(response);
      if(response[0]){
        document.getElementById('voteForm').style.display = "none";
        let validate = document.getElementById("voteValidate");  
        validate.style.display = "block"; 
        validate.innerHTML = "<h5>You have already Voted</h5>"+"<br>" 
                            + "<h6>"+date(response[1])+"</h6>"; 

      }
    })
}

// function for ballot is live or not
function ongoingOrNot(){
    fetch('/currentBallot',{
      withCredentials: true,
      credentials: 'include'
    })
    .then(response => response.json())    // one extra step
    .then(response => { 
      let st = new Date(response.startTime); 
      let et = new Date(response.endTime); 
      let ct = new Date(); 
      if(ct.getTime() > et.getTime()) {
          // console.log("past");
          document.getElementById('voteForm').style.display = "none";
          let validate = document.getElementById("ballotValidate");  
          validate.style.display = "block"; 
          validate.innerHTML = "<h5>This ballot has expired at</h5>"+"<br>" 
                            + "<h6>"+ et +"</h6>"; 
      }
      else if(ct.getTime() < st.getTime()){
          // console.log("future");
          document.getElementById('voteForm').style.display = "none";
          let validate = document.getElementById("ballotValidate");  
          validate.style.display = "block"; 
          validate.innerHTML = "<h5>This ballot will start at</h5>"+"<br>" 
                            + "<h6>"+ st +"</h6>"; 
      }
      else console.log("cuur");

    })
}

/****************** end of time functions *************************/ 

function viewTable() {
    let options = document.getElementById("options"); 
    let candidatesResults = document.getElementById("candidatesResults");
    /*while(candidatesResults.firstChild){
      candidatesResults.removeChild(candidatesResults.firstChild);
    }*/ 

    for(let i = 0; i < canArray.length; i++){
        // render candidate vote count
        let row = "<tr><td>" + (i+1) + 
                    "</td><td>" + canArray[i] +
                    "</td><td>" + voteArray[i] + "</td></tr>";

        candidatesResults.innerHTML+=row;
        //  render candidate choice
        let candidate = `<option value="${i+1}">${canArray[i]}</option>`
        options.innerHTML+=candidate;
    }

}

function viewCandidates(){  

    fetch('/viewCandidates',{
      withCredentials: true,
      credentials: 'include'
    })
    .then(response => response.json())    // one extra step
    .then(response => {

      ballotID = response.id;
      canCount = response.canCount;
    })
    .then(() => {
      
        let votebutton = document.querySelector('#votebutton');
        votebutton.addEventListener("click",function(){
                 
          fetch('./vote',
          {
            withCredentials: true,credentials: 'include',
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({
              id: document.getElementById('options').value, // send only candidate id
            })
          })
          .then(function (response) {
            console.log("vote casted!!, page will refresh");
            // viewCandidates();
          }).then(function (response){
                       
            sweetAlert.fire({
              title: 'Voting Successfull',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            }).then(() => {
                  window.location = "http://localhost:4000/castVote";  
              });
          })

        });
        for (let i = 1; i <= canCount; i++) { 
            fetch('./candidate_i',
            {
              withCredentials: true,
              credentials: 'include',
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                
              },
              body: JSON.stringify({
                id: i, // send only candidate id
              })
            }).then(response => response.json()) 
            .then(function (response) {
                  //console.log(response);
                  canArray.push(response.name); 
                  voteArray.push(response.voteCount);  // x += response.name; console.log(x);

                  if(i == canCount) {
                      viewChart();
                      viewTable();
                  }
            })
            .catch(function (error) {
              console.error(error);
            });
        } 
    }) 
    .then( ongoingOrNot() )
    .then( votedORnot() )
    .catch(error => console.error(error));
}

viewCandidates();