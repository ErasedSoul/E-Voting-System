async function showBallot(){

    const url = "http://localhost:4000/invite/ongoing";
 
    let res  = await fetch(url,{
     method: 'POST',
     withCredentials: true,credentials: 'include', 
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${sessionStorage['accessToken']}`
     },
     body: JSON.stringify({
         username: window.sessionStorage.userName,
     })
     })
 
    let data = await res.json();
    ballots = data.ballots;
 
    console.log(ballots.length);
 
 
    for(let i = 0;i < ballots.length;i++)
    {
         let card = document.createElement("div");  
         card.id = "dashcard" + ((i%6) + 1);
         card.className = "dashcard";
         card.setAttribute("style", "float:left;");
         let ov = document.createElement("div");  
         ov.className = "overlay";
         card.appendChild(ov);
        /* 
         card.addEventListener("click", function() {
           fetch('./setBallotID',{
             method: 'post',
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({
               id: ballots[i].id,
             })
           }).then( () => { 
           window.location = "http://localhost:4000/castVote";  
             }); 
       });
          */
         card.innerHTML+= "<p>" + ballots[i].bname + "<br>" +
         "ballot id :"+ballots[i].bid+"<br>"+
         "starting from:" + ballots[i].startTime + "<br>" +
         "ending at:" + ballots[i].endTime + "</p>";
         
         ballotList.appendChild(card);
    }
      
 }
 showBallot();