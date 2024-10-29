import Layout from "../layout/Layout";
import Header from "../components/header/Header";
import DashboardInfo from "../components/dashboard/DashboardInfo";

const Dashboard = () => {
  return (
    <>
      <Layout>
        <Header header="Dashboard" />
        <DashboardInfo />
      </Layout>
    </>
  );
};

export default Dashboard;
