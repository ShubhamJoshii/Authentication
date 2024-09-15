import React from "react";
import "../styles/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../redux/reducer/userSlice";
const Header = ({ direction }) => {
  const { data } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = async () => {
    dispatch(logoutUser());
  };

  return (
    <header>
      <NavLink to={"/"} style={{ justifyContent: direction ? "end" : "start" }}>
        <span>S</span>
        <span>Shubham Joshi</span>
      </NavLink>
      <div>
        {data?._id ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <NavLink to={"/login"}>Login</NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
