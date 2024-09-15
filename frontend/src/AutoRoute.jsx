import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// Define an AuthRoute component that checks if user is logged in
const AuthRoute = ({ component: Component, ...rest }) => {
  const { data } = useSelector((state) => state.user);
  //   const isAuthenticated = localStorage.getItem('token'); // Or check from global state

  return (
    <Route
      {...rest}
      render={(props) =>
        data._id ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" /> // Redirect to homepage or dashboard if logged in
        )
      }
    />
  );
};

export default AuthRoute;
