import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";
import Logout from "./components/AuthArea/Logout";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import Layout from "./components/Layout/Layout";
import OwnerRestaurantList from "./components/RestaurantArea/OwnerRestaurantList";
import UpdateRestaurant from "./components/RestaurantArea/UpdateRestaurant/UpdateRestaurant";

function App() {
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
            {
              <>
                <Route path="owner" Component={OwnerRestaurantList} />
                <Route
                  path="owner/:restaurantId"
                  Component={UpdateRestaurant}
                />
              </>
            }
            <Route path=":restaurantId" Component={RestaurantPage} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
