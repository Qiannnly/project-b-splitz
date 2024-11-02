import Layout from "../layout/Layout";
import Header from "../components/header/Header";

import ProfileInfo from "../components/profile/ProfileInfo";

const Profile = () => {
  return (
    <>
      <Layout>
        <Header header="User Profile" />
        <ProfileInfo />
      </Layout>
    </>
  );
};

export default Profile;
