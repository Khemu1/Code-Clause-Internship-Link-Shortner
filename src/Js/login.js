import {
  validateLogin,
  transformYupErrorsIntoObject,
  displayError,
} from "./utils.js";

const loginForm = document.querySelector(".login");
let mainError = document.querySelector(".mainError");
let emailError = document.querySelector(".emailError");
let passwordError = document.querySelector(".passwordError");
let EmailField = document.querySelector(".email");
let PasswordField = document.querySelector(".password");

const urlPrefix = "/api";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  let errors;
  try {
    await validateLogin.validate(
      {
        email: formData.get("email"),
        password: formData.get("password"),
      },
      { abortEarly: false }
    );
  } catch (e) {
    errors = transformYupErrorsIntoObject(e);
  }
  if (errors) {
    console.log("i do have errors", errors);
    displayError(errors);
    return;
  }
  mainError.classList.add("hide");
  emailError.classList.add("hide");
  passwordError.classList.add("hide");
  EmailField.classList.remove("red-field");
  PasswordField.classList.remove("red-field");
  retrieve(formData.get("email"), formData.get("password"));
});

function retrieve(email, password) {
  fetch(urlPrefix + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      if (data.success) {
        window.location.href = "http://localhost:5173/pages/home.html";
        return;
      }
      displayError(data.body);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
