import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";
import Logout from "./components/AuthArea/Logout";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import Layout from "./components/Layout/Layout";
import CreateRestaurant from "./components/RestaurantArea/OwnerOnly/CreateRestaurant";
import OwnerRoute from "./components/ProtectedRoutes/OwnerRoute";
import OwnerUserRoute from "./components/ProtectedRoutes/OwnerUserRoute";
import UpdateRole from "./components/UserInfoArea/UpdateRole";
// import useUserInfo from "./hooks/useUserInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Layout}>
          <Route path="" Component={HomePage} />

          <Route path="auth/" element={<Auth />}>
            <Route path="register" Component={Register} />
            <Route path="register" Component={Register} />
            <Route path="login" Component={Login} />
            <Route path="logout" Component={Logout} />
            {/* <Route path="*" element={<Navigate to={"/auth/login"} />} /> */}
          </Route>

          <Route path="/user/update" Component={Auth}>
            <Route
              path="membership"
              element={<OwnerUserRoute element={<UpdateRole />} />}
            />
          </Route>

          <Route path="restaurants">
            <Route
              path="create"
              element={<OwnerRoute element={<CreateRestaurant />} />}
            />

            <Route path=":restaurantId" Component={RestaurantPage} />
            {/**only user or guest can access */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
