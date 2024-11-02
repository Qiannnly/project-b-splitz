import { useEffect, useState } from "react";
import StandardCard from "../shared/StandardCard";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ProfileInput from "./ProfileInput";

import { CircleUserIcon, Lock, Mail } from "lucide-react";
import { deleteUser } from "firebase/auth";
import { Button } from "../ui/button";

type UserProfile = {
  userName: string | null;
  email: string | null;
};

const ProfileInfo = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserProfile>({
    userName: "",
    email: "",
  });

  useEffect(() => {
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;

      setUserData({ userName: displayName, email: email });
    }
  }, [user]);

  const handleDelete = async () => {
    if (user) {
      await deleteUser(user);
      navigate("/signup");
    }
  };

  return (
    <>
      <div className="justify-center items-center m-5 h-1/2 md:flex md:mx-20 md:mt-10 ">
        <StandardCard title="My Profile">
          {userData !== null && (
            <>
              <ProfileInput Icon={CircleUserIcon} value={userData.userName} />
              <ProfileInput Icon={Mail} value={userData.email} />
            </>
          )}
          <ProfileInput Icon={Lock} value={"********"} />
          <div className="text-center mt-14">
            <Button onClick={handleDelete} variant="link">
              Delete account
            </Button>
          </div>
        </StandardCard>
      </div>
    </>
  );
};

export default ProfileInfo;
