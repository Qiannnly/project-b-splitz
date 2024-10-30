import { ReactNode } from "react";
import NavBar from "../components/nav/NavBar";

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
