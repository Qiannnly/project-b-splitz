import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  children: ReactNode;
  footerLabel: string;
  footerSpan: string;
}
const AuthCard = ({ title, children, footerLabel, footerSpan }: CardProps) => {
  return (
    <>
      <Card className="w-[400px] mx-auto mt-12 border-0">
        <CardHeader>
          <CardTitle className="text-center text-5xl mb-4">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>

        <CardFooter className="flex gap-2 items-center justify-center">
          <CardDescription>{footerLabel}</CardDescription>
          <Link
            to={`${footerSpan === "Sign Up" ? "/signup" : "/signin"}`}
            className="text-sm underline"
          >
            {footerSpan}
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default AuthCard;
