import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";
import Logout from "./components/AuthArea/Logout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-special bg-[#f7f7f1]">
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
          {/** home route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
