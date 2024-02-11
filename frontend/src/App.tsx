import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";
import HomePage from "./pages/HomePage";
import useUserInfo from "./hooks/useUserInfo";
import Address from "./pages/Address";
import UserAddressForm from "./components/AddressArea/UserAddressForm";

function App() {
  const { user } = useUserInfo();

  return (
    <div className="min-h-screen flex flex-col bg-primary-special">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={HomePage} />
          {/** auth routes */}
          {!user ? (
            <Route element={<Auth />}>
              <Route path="/auth/register" Component={Register} />
              <Route path="/auth/login" Component={Login} />
              <Route path="*" element={<Navigate to={"/auth/login"} />} />
            </Route>
          ) : (
            <Route Component={Address}>
              <Route
                path="/address/add"
                element={<UserAddressForm title="Add Address" />}
              />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
