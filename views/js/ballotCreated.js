
function showBallot(){
    let ballotCount; 
    var ballotList = document.getElementById("ballotList");

    fetch('/getBallotCount')
    .then(response => response.json())    // one extra step
    .then(response => {
      console.log("inside viewBallot: ", response);
      // document.getElementById("account").innerHTML = response.account;
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

                  var card = document.createElement("div");  
                  card.id = "dashcard" + ((response.id%6) + 1);
                  card.className = "dashcard";
                  card.setAttribute("style", "float:left;"); 
                  card.addEventListener("click", function() {
                      fetch('./setBallotID',{
                        method: 'post',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          id: response.id,
                        })
                      }).then( () => { 
                      window.location = "http://localhost:4000/castVote";  
                        }); 
                  });
                  card.innerHTML = "<p>" + response.name + "<br>" +
                        "starting from:" + response.startTime + "<br>" +
                        "ending at:" + response.endTime + "</p>";


                  var ov = document.createElement("div");  
                  ov.className = "overlay";
                  card.appendChild(ov);


                  ballotList.appendChild(card);

            })
            .catch(function (error) {
              console.error(error);
            });
        }
    })
    .catch(error => console.error(error));
    
}

showBallot();
