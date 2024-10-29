import Layout from "../layout/Layout";
import Header from "../components/header/Header";
import ContactInfo from "../components/contact/ContactInfo";

const Contact = () => {
  return (
    <>
      <Layout>
        <Header header="Contacts" />
        <ContactInfo />
      </Layout>
    </>
  );
};

export default Contact;
