import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Required").email("Email format is invalid"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password must be at least 6 characters"),
});
