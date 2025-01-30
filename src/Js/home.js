import {
  HomedisplayError,
  resetHomeDisplayError,
  validateUrl,
  transformYupErrorsIntoObject,
} from "./utils.js";
const urlPrefix = "/api";
checkSession();
getName();
let icon = document.querySelector(".icon");
let logoutp = document.querySelector(".logout");
let form = document.querySelector("form");
let customUrl = document.querySelector(".custom-url");
let qrContainer = document.querySelector(".qr-containter");

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
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let errors;
  try {
    let shortUrl = formData.get("shortUrl");
    let originalUrl = formData.get("originalUrl");
    console.log(shortUrl);

    await validateUrl.validate(
      {
        originalUrl: originalUrl,
        shortUrl: shortUrl,
      },
      { abortEarly: false }
    );
  } catch (error) {
    errors = transformYupErrorsIntoObject(error);
  }
  if (errors) {
    resetHomeDisplayError();
    HomedisplayError(errors);
    console.log(errors);
    return;
  }
  resetHomeDisplayError();
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
        console.error("session is not authenticated");
        window.location.href = `${urlPrefix}/login`;
      }
    })
    .catch((error) => {
      console.log("Error", error);
      window.location.href = `${urlPrefix}/login`;
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
        window.location.href = `${urlPrefix}/login`;
      } else {
        throw new Error("Error terminating the session");
      }
    })
    .catch((error) => {
      console.log("Error", error);
      window.location.href = `${urlPrefix}/login`;
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
      let qr = data.body.QRCode;
      let qrImg = document.querySelector("#qr-img");
      qrImg.src = qr;
      qrContainer.classList.remove("hidden");
      document.querySelector(".custom-url").value = data.body.shortUrl;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getName() {
  fetch(`${urlPrefix}/name`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("HTTP error, status = " + response.status);
    })
    .then((data) => {
      if (!data.success) {
        return;
      }
      let name = document.querySelector(".name");
      name.textContent = data.body.username;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
