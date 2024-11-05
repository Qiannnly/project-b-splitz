import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}
const StandardCard = ({ title, children }: CardProps) => {
  return (
    <>
      <Card className="w-3/3 h-[400px] md:w-1/3">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
};

export default StandardCard;
