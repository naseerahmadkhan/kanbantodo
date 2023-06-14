import * as Yup from "yup";
import validator from "validator";

export const SignupSchema = Yup.object().shape({
    fname: Yup.string()
      .min(2, "Too Short!")
      .max(8, "Too Long!")
      .required("Valid first name is required"),

    lname: Yup.string()
      .min(2, "Too Short!")
      .max(8, "Too Long!")
      .required("Valid last name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Valid email is required")
      .test(
        "is-valid",
        (message) => `${message.path} is invalid`,
        (value) =>
          value
            ? validator.isEmail(value)
            : new Yup.ValidationError("Invalid value")
      ),

    password: Yup.string()
      // .min(8, 'Too Short!')
      .max(16, "Too Long!")
      .required("Valid password required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Use 8 or more characters with a mix of letters, numbers & symbols"
      ),
    // https://regexr.com/3bfsi

    confirm: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });