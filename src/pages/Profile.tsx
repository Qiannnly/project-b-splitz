import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import Layout from "../layout/Layout";
import Header from "../components/header/Header";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileInput from "../components/profile/ProfileInput";
import { Button } from "../components/ui/button";
import { CircleUserIcon, Lock, Mail } from "lucide-react";
import { deleteUser } from "firebase/auth";

type UserProfile = {
  userName: string | null;
  email: string | null;
};
const Profile = () => {
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
      <Layout>
        <div className="mt-36">
          <Header header="User Profile" />
        </div>

        <ProfileCard title="My Profile">
          {userData !== null && (
            <>
              <ProfileInput Icon={CircleUserIcon} value={userData.userName} />
              <ProfileInput Icon={Mail} value={userData.email} />
            </>
          )}
          <ProfileInput Icon={Lock} value={"********"} />
          <div className="text-center mt-10">
            <Button variant="link" onClick={handleDelete}>
              Delete account
            </Button>
          </div>
        </ProfileCard>
      </Layout>
    </>
  );
};

export default Profile;
