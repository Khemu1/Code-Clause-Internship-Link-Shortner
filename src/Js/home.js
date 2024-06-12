let icon = document.querySelector(".icon");
let logoutp = document.querySelector(".logout");
const urlPrefix = "/api";
checkSession();

icon.addEventListener("click", (e) => {
  let menu = document.querySelector(".menu");
  menu.classList.toggle("hide");
});
document.body.addEventListener("click", (e) => {
  let menu = document.querySelector(".menu");
  if (!icon.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hide");
  }
});
logoutp.addEventListener("click", (e) => { 
  logout();
  return;
})
function checkSession() {
  fetch(`${urlPrefix}/check-session`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("invalid Session");
    })
    .then((data) => {
      if (!data.authenticated) {
        window.location.href = "http://localhost:5173/pages/login.html";
      }
    })
    .catch((error) => {
      console.log("Error", error);
      window.location.href = "http://localhost:5173/pages/login.html";
    });
}

function logout() {
  fetch(`${urlPrefix}/logout`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error terminating the session");
    })
    .then((data) => {
      if (data.success) {
        window.location.href = "/login.html";
      } else {
        throw new Error("Error terminating the session");
      }
    })
    .catch((error) => {
      console.log("Error", error);
      window.location.href = "/login.html";
    });
}
