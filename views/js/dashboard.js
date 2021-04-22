document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {
        menuWidth     : 200,
        edge          : 'right',
        closeOnClick  : true,
        draggable     : true,
    });
  });

// shrabana 
// getting all 10 accounts from ganache
fetch('/getAccounts')
.then(response => response.json())    // one extra step
.then(response => {
	console.log("got the accounts");
 })
 .catch(error => console.error(error));

fetch('/setUserName',{
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: window.sessionStorage.userName,
		})
}) 