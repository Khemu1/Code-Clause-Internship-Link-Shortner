import { object, string } from "yup";

// https://stackoverflow.com/questions/73425133/transform-yup-validation-error-into-a-useable-object
/**
 * Transforms Yup errors into an object.
 * @param {ValidationError} errors - The Yup validation errors.
 * @returns {Record<string, string>} - An object containing the error messages.
 */
export const transformYupErrorsIntoObject = (errors) => {
  const validationErrors = {};

  errors.inner.forEach((error) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};

export const validateUser = object({
  email: string()
    .email("Please enter a valid email")
    .required("No Email provided")
    .label("Email"),
  username: string()
    .required("No user Name provided")
    .label("Username")
    .min(5, "Username is too short , it should be 5 chars  minimum"),
  password: string()
    .required("No passwrod provieded")
    .label("Password")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z0-9 ]/, "Password should only contain Latin letters and Numbers."),
});
export const validateLogin = object({
  email: string()
    .email("Please enter a valid email")
    .required("No Email provided")
    .label("email"),
  password: string().required("No passwrod provieded").label("password"),
});

/**
 *
 * @param {Object} errors
 */
export function displayErrors(errors) {
  let emailError = document.querySelector(".email-error");
  let usernameError = document.querySelector(".username-error");
  let passwordError = document.querySelector(".password-error");
  let EmailField = document.querySelector(".email");
  let UsernameField = document.querySelector(".username");
  let PasswordField = document.querySelector(".password");
  if (errors.email) {
    emailError.innerHTML = errors.email;
    emailError.classList.remove("hide");
    EmailField.classList.add("red-field");
  }
  if (errors.username) {
    usernameError.innerHTML = errors.username;
    usernameError.classList.remove("hide");
    UsernameField.classList.add("red-field");
  }
  if (errors.password) {
    passwordError.innerHTML = errors.password;
    passwordError.classList.remove("hide");
    PasswordField.classList.add("red-field");
  }
}

export function displayError(error) {
  let mainError = document.querySelector(".mainError");
  let emailError = document.querySelector(".emailError");
  let passwordError = document.querySelector(".passwordError");
  let EmailField = document.querySelector(".email");
  let PasswordField = document.querySelector(".password");
  if (error.email) {
    emailError.innerHTML = error.email;
    emailError.classList.remove("hide");
    EmailField.classList.add("red-field");
  }
  if (error.password) {
    passwordError.innerHTML = error.password;
    passwordError.classList.remove("hide");
    PasswordField.classList.add("red-field");
  }
  if (error.error) {
    PasswordField.classList.add("red-field");
    EmailField.classList.add("red-field");
    mainError.classList.remove("hide");
    mainError.innerHTML = error.error;
  }
}
