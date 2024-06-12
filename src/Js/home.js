import {
  HomedisplayError,
  resetHomeDisplayError,
  validateUrl,
  transformYupErrorsIntoObject,
} from "./utils.js";
let icon = document.querySelector(".icon");
let logoutp = document.querySelector(".logout");
let form = document.querySelector("form");
let customUrl = document.querySelector(".custom-url");
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
});


customUrl.addEventListener("click", (e) => {
  resetHomeDisplayError();
});
form.addEventListener("submit", async(e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let errors;
  try {
    let shortUrl = formData.get("shortUrl");
    await validateUrl.validate(
      {
        shortUrl: shortUrl,
      },{abortEarly: false});
  } catch (error) {
    errors = transformYupErrorsIntoObject(error);
  }
  if (errors) {
    console.log("i do have errors", errors);
    HomedisplayError(errors);
    return;
  }
  insertUrl(formData);
});
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
function insertUrl(formData) {
  fetch(`${urlPrefix}/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originalUrl: formData.get("originalUrl"),
      shortUrl: formData.get("shortUrl"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.success) {
        HomedisplayError(data.body);
        return;
      }
      customUrl.classList.add("valid");
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
