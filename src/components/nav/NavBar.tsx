import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { NavBarItems } from "./NavBarItems";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";

const NavBar = () => {
  const { logOut, user } = useUserContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="w-full pt-2 pb-2 top-0 fixed text-black lg:pt-0 border-b-2 border-b-gray-300  bg-white">
        <div className="flex justify-between mb-5 px-5 lg:px-8 items-center lg:mb-0">
          <div
            className="text-3xl lg:text-5xl w-3/6 pt-5 lg:w-2/6 lg:pt-3 z-10 font-bold"
            onClick={() => navigate("/dashboard")}
          >
            B-Splitz
          </div>
          <div
            className={` w-full left-0 bg-white absolute justify-between  py-5 lg:flex lg:w-4/6 lg:static ${
              open ? "top-20" : "top-[-490px]"
            }`}
          >
            <div className="pl-8 text-center space-y-3 lg:space-x-20 lg:pt-7 lg:space-y-0 lg:flex">
              {NavBarItems.map((item, key) => (
                <div key={key}>
                  <Link
                    to={item.path}
                    key={key}
                    className="lg:text-xl text-black hover:border hover:px-4 hover:py-1 hover:rounded-lg hover:bg-[#8A9A5B] hover:text-white"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center ml-8 z-20">
              {user !== null && (
                <Button asChild>
                  <Link
                    to="/signin"
                    onClick={() => logOut()}
                    className="text-[22px]"
                  >
                    Log Out
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div
            className="mt-5 cursor-pointer z-10 md:hidden"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon size={"36px"} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
