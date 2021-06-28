function TimeConvert(t)
{
     let date = new Date(t);
     return date;
}
async function showBallot(){

    const url = "http://localhost:4000/invite/ongoing";
 
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
 
    console.log(ballots.length);
 
 
    for(let i = 0;i < ballots.length;i++)
    {
        let card = document.createElement("div");  
        card.id = "dashcard"+((Math.floor((Math.random() * 100) + 1))%16);
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
         
      let ballotName = document.createElement("div");
      ballotName.className = "ballotName";
      ballotName.innerHTML = ballots[i].bname;  
      
      //status
      let status  = document.createElement("div");
      status.className = "status";
      let live = document.createElement("div");
      live.className = "live";
      let statusWord = document.createElement("div");
      statusWord.className = "statusWord";
      statusWord.innerHTML = "LIVE"; 
      status.appendChild(live);
      status.appendChild(statusWord);

      //timeShow
      let startDate = TimeConvert(ballots[i].startdate);
      let endDate = TimeConvert(ballots[i].enddate); 
      let seconds = (endDate- Date.now())/1000;
      let timeShow = document.createElement("div");
      timeShow.className = "timeShow";
      timeShow.id = ballots[i].ballotid;
      //timeShow.innerHTML= "Ends in "+seconds;


      //timer code
      let timer = new easytimer.Timer();
      timer.start({countdown: true, startValues: {seconds: seconds}});
        timeShow.innerHTML = "ENDS IN "+timer.getTimeValues().toString();

        timer.addEventListener('secondsUpdated', function (e) {
            timeShow.innerHTML = "ENDS IN "+timer.getTimeValues().toString();
        });

        timer.addEventListener('targetAchieved', function (e) {
            timeShow.innerHTML = 'ENDED';
        });

      //add everyting in card
      card.appendChild(ballotName);
      card.appendChild(status);
      card.appendChild(timeShow);
      ballotList.appendChild(card);

    }
      
 }
 showBallot();
