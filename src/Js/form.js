import { validateUser, transformYupErrorsIntoObject } from "./utils.js";

const registerForm = document.querySelector(".register");

const urlPrefix = "/api";

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  let errors;
  // try {
  //   await validateUser.validate(
  //     {
  //       email: formData.get("email"),
  //       username: formData.get("username"),
  //       password: formData.get("password"),
  //     },
  //     { abortEarly: false }
  //   );
  // } catch (e) {
  //   errors = transformYupErrorsIntoObject(e);
  // }
  // if (errors) {
  //   console.log("i do have errors", errors);
  //   return;
  // }
  retrieve("ALIFSAFASF");
  // submit(formData);
  console.log(formData);
});

function submit(data) {
  fetch(urlPrefix + "/user", {
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
      console.log("Data sent: " + data);
    })
    .catch((error) => {
      console.error("Something went wrong when sending data:", error);
    });
}

function retrieve(name) {
  fetch(urlPrefix + "/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "ALIFSAFASF",
      email: "alghost2004@gmail.com",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      // Access the response body data here
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
