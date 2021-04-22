function date(utcSeconds){
    // var utcSeconds = 1234567890;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    return d;
}

function votedORnot(){
    fetch('/votedORnot')
    .then(response => response.json())    // one extra step
    .then(response => {
      console.log(response);
      if(response[0]){
        $("#voteForm").hide();

        let validate = document.getElementById("voteValidate");
        validate.innerHTML = "vote status:" + response[0] + "<br>" 
                            + "vote time: " + date(response[1]) + "<br>"
                            + "block mined: " + response[2]; 

      }
    })
}

function vote(candidateId){
  // var candidateId = $('#candidatesSelect').val();
  fetch('./vote',
  {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: candidateId, // send only candidate id
    })
  })
  .then(function (response) {
    console.log("vote casted!!, page will refresh");
    viewCandidates();
  })
  .catch(function (error) {
    console.error(error);
  });
}

function viewCandidates(){
    let voteForm = document.getElementById("voteForm");

    let ballotID, canCount; 
    var candidatesResults = $("#candidatesResults");
    candidatesResults.empty();

    fetch('/viewCandidates')
    .then(response => response.json())    // one extra step
    .then(response => {

      ballotID = response.id;
      canCount = response.canCount;
    })
    .then(() => { 
        for (var i = 1; i <= canCount; i++) { 
            fetch('./candidate_i',
            {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: i, // send only candidate id
              })
            }).then(response => response.json()) 
            .then(function (response) {
                  console.log(response);
                  
                  // render candidate vote count
                  var row = "<tr><th>" + response.id + 
                              "</th><td>" + response.name +
                              "</th><td>" + response.voteCount + "</td></tr>";

                  candidatesResults.append(row);

                  //  render candidate choice
                  var candidate = document.createElement("div");  
                  candidate.className = "dashcard";
                  candidate.setAttribute("style", "float:left;"); 
                  
                  candidate.addEventListener("click", function(){
                      fetch('./vote',
                      {
                        method: 'post',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          id: response.id, // send only candidate id
                        })
                      })
                      .then(function (response) {
                        console.log("vote casted!!, page will refresh");
                        viewCandidates();
                      })
                      .catch(function (error) {
                        console.error(error);
                      });
                  });

                  candidate.innerHTML = response.name;

                  voteForm.appendChild(candidate);

            })
            .catch(function (error) {
              console.error(error);
            });
        }
    }).then( votedORnot() )
    .catch(error => console.error(error));
}

viewCandidates();
