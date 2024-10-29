import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Form } from "../components/ui/form";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../schema/LoginSchema";
import { Button } from "../components/ui/button";
import FormFields from "../components/auth/FormFields";
import AuthCard from "../components/auth/AuthCard";

type User = Yup.InferType<typeof LoginSchema>;

const SignIn = () => {
  const [message, setMessage] = useState("");
  const { signIn } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<User>({
    resolver: yupResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: User) => {
    try {
      const result = await signIn(email, password);
      if (result !== null) {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("You do not have a registered account.");
      console.log(err);
    }
  };

  return (
    <AuthCard
      title="Welcome Back to B-Splitz"
      footerLabel="Do not have an account?"
      footerSpan="Sign Up!"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-red-700">{message && message}</div>
          <FormFields name="email" placeholder="Email" type="email" />
          <FormFields name="password" placeholder="Password" type="text" />
          <Button className="w-full" type="submit">
            Log In
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignIn;
