import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}
const StandardCard = ({ title, children }: CardProps) => {
  return (
    <>
      <Card className="w-[400px] overflow-y-scroll shadow-md h-[640px] ">
        <CardHeader>
          <CardTitle className="text-xl lg:text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
};

export default StandardCard;
