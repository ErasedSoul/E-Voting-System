
function date(utcSeconds){
    // let utcSeconds = 1234567890;
    let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    return d;
}

function votedORnot(){
    fetch('/votedORnot',{
      withCredentials: true,
      credentials: 'include'
    })
    .then(response => response.json())    // one extra step
    .then(response => {
      console.log(response);
      if(response[0]){
        document.getElementById('voteForm').style.display = "none";
        let validate = document.getElementById("voteValidate");  
        validate.style.display = "block"; 
        validate.innerHTML = "<h5>You have already Voted</h5>"+"<br>" 
                            + "<h6>"+date(response[1])+"</h6>"; 

      }
    })
}

function vote(candidateId){
  // let candidateId = $('#candidatesSelect').val();
  fetch('./vote',
  {
    method: 'post',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      
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
    let options = document.getElementById("options"); 
    let ballotID, canCount; 
    let candidatesResults = document.getElementById("candidatesResults");
    while(candidatesResults.firstChild){
      candidatesResults.removeChild(candidatesResults.firstChild);
    }

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
            viewCandidates();
          }).then(function (response){
                       
            sweetAlert.fire({
              title: 'Voting Successfull',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            })
               
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
                  console.log(response);
                  
                  // render candidate vote count
                  let row = "<tr><td>" + response.id + 
                              "</td><td>" + response.name +
                              "</td><td>" + response.voteCount + "</td></tr>";

                  candidatesResults.innerHTML+=row;
                  //  render candidate choice
                  let candidate = `<option value="${response.id}">${response.name}</option>`
                  options.innerHTML+=candidate;

            })
            .catch(function (error) {
              console.error(error);
            });
        }
    }).then( votedORnot() )
    .catch(error => console.error(error));
}

viewCandidates();


