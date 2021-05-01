async function showBallot(){

   const url = "http://localhost:4000/user/ongoing";

   let res  = await fetch(url,{
    method: 'POST',
    withCredentials: true,credentials: 'include', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: window.sessionStorage.userName,
    })
    })

   let ballots = await res.json();
   //ballots = data.ballots;


    for(let i = 0;i < ballots.length;i++)
    {
        let card = document.createElement("div");  
        card.id = "dashcard" + ((i%6) + 1);
        card.className = "dashcard";
        card.setAttribute("style", "float:left;");
        let ov = document.createElement("div");  
        ov.className = "overlay";
        card.appendChild(ov);
        
        card.addEventListener("click", function() {
          fetch('http://localhost:4000/setBallotID',{
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: ballots[i].ballotid,
            })
          }).then( () => { 
          window.location = "http://localhost:4000/castVote";  
            }); 
      });
         
        card.innerHTML+= "<p>" + ballots[i].bname + "<br>" +
        "ballot id :"+ballots[i].ballotid+"<br>"+
        "starting from:" + ballots[i].startdate + "<br>" +
        "ending at:" + ballots[i].enddate + "</p>";
        
        ballotList.appendChild(card);
    }
     
}
showBallot();
