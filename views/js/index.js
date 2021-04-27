
var storage = window.sessionStorage;
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const voteword = document.querySelector("#votewordanime");
const signinsubmit = document.querySelector("#signinsubmit");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  voteword.setAttribute("display", "none");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  voteword.setAttribute("display", "");
});







// Login Validation logic.

signinsubmit.addEventListener('submit',(event)=>{
    
    event.preventDefault();
    const user = document.forms[0][0].value;
    const pass = document.forms[0][1].value;
    
    if(user == "" || pass == "")
    {
      sweetAlert.fire({
        title: 'Oops...',
        text: 'Please enter username & password !',
        icon: 'warning',
        confirmButtonText: 'Cool',
      })
    }
    else{
       
      fetch('http://localhost:4000/login',{
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            username: user,
            password: pass
        }) 
    }).then(res => {     
       return res.text();
    })
    .then(data => {
       return JSON.parse(data)
    }).then(data => {

       if(data.check === "1")
       {
          sessionStorage.setItem('accessToken',data.accessToken);
          sessionStorage.setItem('refreshToken',data.refreshToken);
          sessionStorage.setItem('userName', user);
          sweetAlert.fire({
            title: 'Login Successful',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          }).then(function() {
            window.location = "http://localhost:4000/home";
          })
       } 
       else
       {
        sweetAlert.fire({
          title: 'Oops...',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        })
       } 
    })
    }
})


//sign up 
signupsubmit.addEventListener('submit',(event)=>{
    
  event.preventDefault();
  const user = document.forms[1][0].value;
  const email = document.forms[1][1].value;
  const pass = document.forms[1][2].value;
  const confirmpass = document.forms[1][3].value;
  
  console.log(email);

  if(user == "" || pass == "" || confirmpass=="" || email == "")
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'It seems you have left some fields empty !',
      icon: 'warning',
      confirmButtonText: 'Cool'
    })
  }
  else if(pass !== confirmpass)
  {
    sweetAlert.fire({
      title: 'Oops...',
      text: 'Password & confirm password must be same',
      icon: 'warning',
      confirmButtonText: 'Cool'
    })
  }
  else
  {
        fetch('http://localhost:4000/signup',{
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
              username: user,
              password: pass,
              emailId: email
          })
        }).then(res =>{
            return res.text();
        }).then(data => {
           return JSON.parse(data);
        }).then(data => {
              
              if(data.check == '0')
              {
                    sweetAlert.fire({
                      title: 'Oops...',
                      text: data.message,
                      icon: 'warning',
                      confirmButtonText: 'Cool'
                    })
              }
              else
              {
                    (async() =>{
                    const { value: otp } = await Swal.fire({
                      title: 'Enter OTP',
                      input: 'text',
                      inputLabel: 'OTP',
                      showCancelButton: true,
                      allowOutsideClick: false,
                      inputValidator: (value) => {
                        if (!value) {
                          return 'You need to enter otp'
                        }
                      }
                    })
                    
                    if(otp !== null)
                    {
                         // send post req to checkotp
                        
                        fetch('http://localhost:4000/checkotp',{
                            method: 'POST', 
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                username: user,
                                emailId: email,
                                otp: otp
                            })
                          }).then(res =>{
                              return res.text();
                          }).then(data => {
                            return JSON.parse(data);
                          }).then(data =>{

                                  if(data.check == '1')
                                  {
                                    sweetAlert.fire({
                                      title: 'Hey!',
                                      text: data.message,
                                      icon: 'success',
                                      showConfirmButton: false,
                                      timer: 3000,
                                      timerProgressBar: true
                                    }).then(function(){
                                       window.location.reload();
                                    })
                                  }
                                  else
                                  {
                                    sweetAlert.fire({
                                      title: 'Oops...',
                                      text: data.message,
                                      icon: 'error',
                                      confirmButtonText: 'Cool'
                                    })
                                  }
                          })
                    }
                    
                    })();
               }
        })
}

})









//jwt