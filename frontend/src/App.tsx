import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";
import Logout from "./components/AuthArea/Logout";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import Layout from "./components/Layout/Layout";
import CreateRestaurant from "./components/RestaurantArea/CreateRestaurant";
import useUserInfo from "./hooks/useUserInfo";
import { Role } from "./models/User";
// import useUserInfo from "./hooks/useUserInfo";

function App() {
  const { user } = useUserInfo();
  return (
    <BrowserRouter>
      <Routes>
        {/** home route */}
        <Route path="/" Component={Layout}>
          <Route path="" Component={HomePage} />
          {/** auth routes */}
          <Route path="auth/" element={<Auth />}>
            <Route path="register" Component={Register} />
            <Route path="register" Component={Register} />
            <Route path="login" Component={Login} />
            <Route path="logout" Component={Logout} />
            {/* <Route path="*" element={<Navigate to={"/auth/login"} />} /> */}
          </Route>
          {/** restaurant route*/}
          <Route path="restaurants">
            <>
              {user?.role === Role.owner && (
                <Route path="create" Component={CreateRestaurant} />
              )}
              <Route path=":restaurantId" Component={RestaurantPage} />
            </>
            {/**only user or guest can access */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
