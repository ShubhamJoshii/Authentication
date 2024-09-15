import React from "react";
import { useSelector } from "react-redux";
import '../styles/Home.css';
import Header from "../components/Header";

const Home = () => {
  const { data } = useSelector((state) => state.user);
  
  return (
    <>
    <Header />
    <div className="HomePage" id="content">
      <p id="textHome">Welcome</p>
      {
        data?._id && <>
          <p>{data?._id}</p>
          <h1>{data?.FirstName} {data?.LastName}</h1>
          <h1>{data?.Email}</h1>
        </>
      }
      {/* <p style={{ textTransform: "uppercase" }}>{data.Provider}</p> */}
      {/* <h1>{userName}</h1> */}
      <h2>{data?._id ? "Happy, to see you back" : "We Are The MERN Developer"}</h2>
    </div>
    </>
  );
};

export default Home;
