const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const voteword = document.querySelector("#votewordanime");
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  voteword.setAttribute("display", "none");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  voteword.setAttribute("display", "");
});




// Login Validation logic.




//jwt