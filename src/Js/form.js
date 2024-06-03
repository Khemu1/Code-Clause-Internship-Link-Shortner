import { validateUser, transformYupErrorsIntoObject } from "./utils.js";

const registerForm = document.querySelector(".register");

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
    return;
  }
  console.log("all valid");
  submit(formData);
});

function submit(formData) {
  fetch(urlPrefix + "/register", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.text();
    })
    .then(async (data) => {
      console.log("Data sent:");
    })
    .catch((error) => {
      console.error("Something went wrong when sending data:", error);
    });
}
