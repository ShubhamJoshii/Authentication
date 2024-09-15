import React from "react";
import "../../styles/AuthStructure.css";
import LoginImg from "../../assets/SecureLogin.png";
import SecureSignup from "../../assets/SecureSignup.png";
import SetPassword from "../../assets/SetPassword.png";
import Carousel from "react-multi-carousel";
import Header from "../../components/Header";
const responsive = {
  mobile: {
    breakpoint: { max: 3000, min: 0 },
    items: 1,
  },
};

const AuthStructure = ({ direction = false, Content }) => {
  return (
    <>
      <Header direction={direction}/>
      <div id="content">
        <div
          id="AuthStructure"
          style={{ flexDirection: direction ? "row-reverse" : "row" }}
        >
          <div id="formContainer">{Content && <Content />}</div>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            // autoPlay={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={1000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["mobile"]}
            dotListClass="custom-dot-list-style"
            className="Carousel "
            itemClass="carousel-item-padding-40-px"
          >
            <img src={LoginImg} alt="SecureLogin" />
            <img src={SecureSignup} alt="SecureLogin" />
            <img src={SetPassword} alt="SecureLogin" />
          </Carousel>
          ;
        </div>
      </div>
    </>
  );
};

export default AuthStructure;
