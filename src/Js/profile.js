checkSession();
getInfo();
let icon = document.querySelector(".icon");
let logoutp = document.querySelector(".logout");
const urlPrefix = "/api";

icon.addEventListener("click", (e) => {
  let menu = document.querySelector(".menu");
  menu.classList.toggle("hide");
});
document.body.addEventListener("click", (e) => {
  let menu = document.querySelector(".menu");
  let qrImg = document.querySelector(".qr-img");
  if (!icon.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hide");
  }
});
logoutp.addEventListener("click", (e) => {
  logout();
  return;
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
async function getInfo() {
  fetch(`${urlPrefix}/info`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("invalid Session");
    })
    .then(async (data) => {
      await attachEvents(data.body);
    })
    .catch((error) => {
      console.log("Error", error);
      window.location.href = "http://localhost:5173/pages/login.html";
    });
}

/**
 *
 * @param {Array} data
 */
function displayInfo(data) {
  let section = document.querySelector("section");
  section.innerHTML = "";
  data.forEach((item) => {
    let username = item.username;
    document.querySelector(".name").textContent = `${username}`;
    let div = document.createElement("div");
    div.classList.add("data");
    div.innerHTML = `
        <div class="link-qr">
          <div class="link"><a href="${item.shortUrl}" target="_blank">${
      item.shortUrl.split("/")[4]
    }</a></div>
          <div class="qr"><img src ="../../public/assets/images/qr-code-svgrepo-com.svg" ></div>
        </div>
        <div class="info">
          Total Number of Visits: <span class="visits">${item.views}</span>
        </div> 
        <img src="${item.qrCode}" class="qr-img hidden">
    `;
    document.querySelector("section").appendChild(div);
  });
}

async function attachEvents(data) {
  await displayInfo(data);
  let dataElements = document.querySelectorAll(".data");
  dataElements.forEach((element) => {
    let link = element.querySelector(".link a");
    const qrButton = element.querySelector(".qr");
    let visits = element.querySelector(".visits");
    qrButton.addEventListener("click", (e) => {
      let qrImg = element.querySelector(".qr-img");
      qrImg.classList.toggle("hidden");
    });

    link.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(link.href);
      let newTab = window.open(link.href, "_blank");
      newTab.focus();
      try {
        let oldValue = visits.textContent;
        let newValue = parseInt(oldValue) + 1;
        visits.textContent = newValue;
      } catch (error) {
        console.error("Error updating visit count:", error);
      }
    });
  });
}
