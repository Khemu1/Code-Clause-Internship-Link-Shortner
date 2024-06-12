import {
  validateUser,
  transformYupErrorsIntoObject,
  displayErrors,
} from "./utils.js";

const registerForm = document.querySelector(".register");
let emailError = document.querySelector(".email-error");
let usernameError = document.querySelector(".username-error");
let passwordError = document.querySelector(".password-error");
let EmailField = document.querySelector(".email");
let UsernameField = document.querySelector(".username");
let PasswordField = document.querySelector(".password");

const urlPrefix = "/api";

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  let errors;
  try {
    await validateUser.validate(
      {
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
      },
      { abortEarly: false }
    );
  } catch (e) {
    errors = transformYupErrorsIntoObject(e);
  }
  if (errors) {
    console.log("i do have errors", errors);
    displayErrors(errors);
    return;
  }
  emailError.classList.add("hide");
  usernameError.classList.add("hide");
  passwordError.classList.add("hide");
  EmailField.classList.remove("red-field");
  UsernameField.classList.remove("red-field");
  PasswordField.classList.remove("red-field");
  retrieve(formData.get("email"), formData.get("username"),formData);
});

function submit(data) {
  fetch(urlPrefix + "/register", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        window.location.href = "http://localhost:5173/pages/home.html";
      } else {
        console.error("Registration failed:", data.body);
      }
    })
    .catch((error) => {
      console.error("Something went wrong when sending data:", error);
    });
}

function retrieve(email, username, formData) {
  fetch(urlPrefix + "/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.success) {
        submit(formData);
      } else {
        displayErrors(data.body);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
