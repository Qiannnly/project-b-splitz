import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import * as Yup from "yup";
import { Form } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchema } from "../schema/RegisterSchema";
import { Button } from "../components/ui/button";
import FormFields from "../components/auth/FormFields";
import AuthCard from "../components/auth/AuthCard";

type User = Yup.InferType<typeof RegisterSchema>;

const SignUp = () => {
  const { signUp } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<User>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: { userName: "", email: "", password: "" },
  });

  const onSubmit = async ({ userName, email, password }: User) => {
    try {
      await signUp(userName, email, password);
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthCard
      title="Register Account"
      footerLabel="Already have an account?"
      footerSpan="Sign In!"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
          <FormFields name="userName" placeholder="Username" type="text" />
          <FormFields name="email" placeholder="Email" type="email" />
          <FormFields name="password" placeholder="Password" type="text" />
          <Button className="w-full" type="submit">
            Register
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignUp;
