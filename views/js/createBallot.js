
let voters,candidates,ballotName,startDate,endDate,startTime,endTime;
let currentTab = 0;

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}


function currentDate(n){

    let date = new Date();
    if(n > 0)
    date.addHours(n);
    let dd =  date.getDate();
    let mm =  date.getMonth()+1;
    let yyyy = date.getFullYear();

    if(dd < 10)
    {
        dd = '0'+dd;
    }
    if(mm < 10)
    {
        mm = '0'+mm;
    }

    return `${yyyy}-${mm}-${dd}`
}

 let currentTime = function(n){
    let date = new Date();
    if(n > 0)
    date.addHours(n);

    let hh = date.getHours();
    let mm = date.getMinutes();

    if(hh < 10)
    {
        hh = '0'+hh;
    }
    if(mm < 10)
    {
        mm = '0'+mm;
    }
    return `${hh}:${mm}`
}

 let format24 = function(time) {
    var hrs = Number(time.match(/^(\d+)/)[1]);
    var mnts = Number(time.match(/:(\d+)/)[1]);
    var format = time.match(/\s(.*)$/)[1];
    if (format == "PM" && hrs < 12) hrs = hrs + 12;
    if (format == "AM" && hrs == 12) hrs = hrs - 12;
    var hours = hrs.toString();
    var minutes = mnts.toString();
    if (hrs < 10) hours = "0" + hours;
    if (mnts < 10) minutes = "0" + minutes;
    return hours + ":" + minutes;
}
let format12 = function(time) {
    var hrs = Number(time.match(/^(\d+)/)[1]);
    var mnts = Number(time.match(/:(\d+)/)[1]);
    let s;
    if (hrs < 12) s=" AM";
    else 
    {
    s=" PM";
    hrs=hrs-12;
    }
    var hours = hrs.toString();
    var minutes = mnts.toString();
    if (hrs < 10) hours = "0" + hours;
    if (mnts < 10) minutes = "0" + minutes;
    
    return hours + ":" + minutes+s;
}






document.addEventListener('DOMContentLoaded',function() {
    
    //ballotName
    ballotName = document.querySelector('#ballotName');

    //startDate
    startDate = document.querySelector('#startDate');
    startDate = M.Datepicker.init(startDate,{
        format: 'yyyy-mm-dd',
        autoClose: true,
    });
    startDate.el.value = currentDate(0);
    startDate.setDate(new Date());

    //endDate
    endDate = document.querySelector('#endDate');
    endDate = M.Datepicker.init(endDate,{
        format: 'yyyy-mm-dd',
    });
    endDate.el.value = currentDate(2);
    endDate.setDate(new Date().addHours(2));

    //startTime    
    startTime = document.querySelector('#startTime');
    startTime = M.Timepicker.init(startTime,{
       defaultTime: 'now',
       autoClose: true
    });
    startTime.el.value = format12(currentTime(0));

    //endTime 
    endTime = document.querySelector('#endTime');
    endTime = M.Timepicker.init(endTime,{
         autoClose: true
    });
    endTime.el.value = format12(currentTime(2));


    candidates = document.querySelector('#candidates');
    candidates = M.Chips.init(candidates,{
        placeholder:'Type and Enter',
        secondaryPlaceholder: '+Candidate',
        limit: 20
    });


    voters = document.querySelector('#voters');
    voters = M.Chips.init(voters,{
        placeholder:'Type and Enter',
        secondaryPlaceholder: '+Voter',
        limit: 1000
    });
    
    document.getElementById("nextBtn").addEventListener('click',function(){             
        nextTab(1);
    });
    
    document.getElementById("prevBtn").addEventListener('click',function(){
             
          nextTab(-1);
    });
    showTab(currentTab);

  });

async function validateSubmit(){

  if(ballotName.value == "")
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'You should provide a ballot name',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    return false;
  }
  if(startDate.el.value == "" || startTime.value == "")
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'Please provide start time and date',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    return false;
  }
  if(startDate.el.value == "" || startTime.el.value == "")
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'Please provide start time and date',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    return false;
  }

  if(endDate.el.value == "" || endTime.el.value == "")
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'Please provide end time and date',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    return false;
  }

  if(candidates.chipsData.length < 2)
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'You must create atleast 2 candidates',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    return false;
  }
  startTime = startDate.el.value+" "+format24(startTime.el.value)+":00";
  endTime = endDate.el.value+" "+format24(endTime.el.value)+":00";
  
  let canString = "";
  let Voters = [];
  for(let i = 0; i < candidates.chipsData.length;i++)
    canString = canString+candidates.chipsData[i]['tag']+",";

    for(let i = 0; i < voters.chipsData.length;i++)
    Voters.push(voters.chipsData[i]['tag']);  

  let res = await fetch('http://localhost:4000/setBallot',{
     method: 'POST',
     withCredentials: true,
     credentials: 'include',
     headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage['accessToken']}`
     },
     body: JSON.stringify({
         name: ballotName.value,
         startTime: startTime,
         endTime: endTime,
         canString: canString,
         voters: Voters 
     })
  });
   //if(res.status == 401)
     // return false;
   return true;

}  

function showTab(n) {
  let x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  fixStepIndicator(n)
}

async function nextTab(n) {
  let x = document.getElementsByClassName("tab");

  if (currentTab+n >= x.length) {
   let check = await validateSubmit();
   if(check == false)
     return;

   sweetAlert.fire({
    title: 'Vote Created Successful',
    icon: 'success',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  }).then(function() {
    window.location = "http://localhost:4000/home";
  })
    return;
  }
  else{
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  showTab(currentTab);
  }
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  let i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

