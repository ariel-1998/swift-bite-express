import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";
import Logout from "./components/AuthArea/Logout";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          {/** home route */}
          <Route path="/" Component={HomePage} />
          {/** auth routes */}
          <Route element={<Auth />}>
            <Route path="/auth/register" Component={Register} />
            <Route path="/auth/login" Component={Login} />
            <Route path="/auth/logout" Component={Logout} />
            <Route path="*" element={<Navigate to={"/auth/login"} />} />
          </Route>
          {/** restaurant route*/}
          <Route path="restaurants">
            <Route path=":restaurantId" Component={RestaurantPage} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
