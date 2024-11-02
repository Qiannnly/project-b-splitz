import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type CardProps = {
  title: string;
  children: ReactNode;
};

const ProfileCard = ({ title, children }: CardProps) => {
  return (
    <>
      <Card className="md:w-1/3">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
};

export default ProfileCard;
