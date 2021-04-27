document.addEventListener('DOMContentLoaded', function() {
    let sidenav = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(sidenav, {
        menuWidth     : 200,
        edge          : 'right',
        closeOnClick  : true,
        draggable     : true,
    });

    let tooltipped = document.querySelectorAll('.tooltipped');
    let instances2 = M.Tooltip.init(tooltipped, {
      transitionMovement: 10,
      position: 'left'
    });
      
    let logoutClass = document.getElementsByClassName("deleteTokens");

    for(let i = 0;i < logoutClass.length;i++){
        logoutClass.item(i).addEventListener('click',function(){              
            sessionStorage.clear();
        });
     }
  });

// shrabana 
// getting all 10 accounts from ganache
fetch('/getAccounts',{
  withCredentials: true,
  credentials: 'include', 
  headers: {
     'Authorization': `Bearer ${sessionStorage['accessToken']}`
  }

})
.then(response => response.json())    // one extra step
.then(response => {
	console.log("got the accounts");
 })
 .catch(error => console.error(error));

fetch('/setUserName',{
        method: 'POST',
        withCredentials: true,
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage['accessToken']}`
        },
        body: JSON.stringify({
            userName: window.sessionStorage.userName,
		})
}) 