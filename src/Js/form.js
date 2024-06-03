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
});

function submit(data) {
  fetch(urlPrefix + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error("There has been a problem with your fetch operation:", err);
    });
}
