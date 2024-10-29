import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  userName: Yup.string().required("Required"),
  email: Yup.string().required("Required").email("Email format is invalid"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password must be at least 6 characters"),
});
