import "./App.css";
import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  Navigate,
} from "react-router-dom";

const Login = lazy(() => import("./Pages/auth/login"));
const Register = lazy(() => import("./Pages/auth/register"));
import "react-multi-carousel/lib/styles.css";
import ForgetPassword from "./Pages/auth/ForgetPassword/ForgetPassword";
// import VerifyCode from "./Pages/auth/VerifyCode";
// import SetNewPassword from "./Pages/auth/SetNewPassword";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./redux/reducer/userSlice";
import Home from "./Pages/home";

const RedirectIfAuthenticated = ({ children }) => {
  const { data } = useSelector((state) => state.user);
  // return data._id ? <Navigate to="/" /> : children;
  return children
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              }
            />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            {/* <Route path="*" element={<p>Hello World</p>} /> */}

            
            {/* <Route path="/verifycode" element={<VerifyCode />} />
            <Route path="/setpassword" element={<SetNewPassword />} /> */}
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
