import Layout from "../layout/Layout";
import Header from "../components/header/Header";
import GroupInfo from "../components/group/GroupInfo";

const Contact = () => {
  return (
    <>
      <Layout>
        <Header header="Groups" />
        <GroupInfo />
      </Layout>
    </>
  );
};

export default Contact;
