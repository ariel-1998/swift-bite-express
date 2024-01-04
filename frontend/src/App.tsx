import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Register from "./components/AuthArea/Register";
import Login from "./components/AuthArea/Login";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-special">
      <BrowserRouter>
        <Routes>
          {/** auth routes */}
          <Route element={<Auth />}>
            <Route path="/auth/register" Component={Register} />
            <Route path="/auth/login" Component={Login} />
            <Route path="*" element={<Navigate to={"/auth/login"} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
