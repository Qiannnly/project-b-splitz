import { UserContextProvider } from "./context/UserContext";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

const App = () => {
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </>
  );
};

export default App;
