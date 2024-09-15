import React from "react";
import AuthStructure from "./AuthStructure";
import { NavLink } from "react-router-dom";

import Input from "../../components/Input";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import HashLoader from "react-spinners/HashLoader";

import { deleteUser, registerUser, resendOtp, updatePage } from "../../redux/reducer/userSlice";

const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();



  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    // Handle form submission here (e.g., send data to an API)
  };

  const { data, error, status} = useSelector((state) => state.user);
  // const _id = data?._id;
  // console.log(data)
  return (
    <>
    {status === "loading" && (
        <div className="loading">
          <HashLoader
            color={"black"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div id="backBtn" onClick={()=>{dispatch(deleteUser(data?._id))}}>
        <HiOutlineChevronLeft />
        <p>Back to sign up</p>
      </div>
      <h1>Verification Email</h1>
      {/* <p>Thank you for signing up.</p> */}
      <p>Verfication email has been sent to:</p>
      <div id="emailVerify">
        <span onClick={() => dispatch(deleteUser(data?._id))}>(edit)</span>
        <span>{data.Email}</span>
      </div>
      <form>
        <p id="Resend">
          Didn’t receive a code? <span onClick={()=>dispatch(resendOtp(data?._id))}>Resend</span>
        </p>
      </form>
      {
        error?.target === "OTP" && <p id="message">{error?.message}</p>
      }
    </>
  );
};
const Content2 = () => {
  return (
    <>
      <h1>Email Verified</h1>
      <p>Verfication email has been Verified</p>
      <NavLink to={"/login"} id="loginRedirect">
        Login
      </NavLink>
    </>
  );
};

const Content3 = () => {
  return (
    <>
      <h1>Email Already Verified</h1>
      <p>Verfication email has been Already Verified</p>
      <span>Continue with login</span>
      <NavLink to={"/login"} id="loginRedirect">
        Login
      </NavLink>
    </>
  );
};

const VerifyEmail = ({ direction }) => {
  const { page } = useSelector((state) => state.user);
  return (
    <>
      {page === "SendedVerificationMail" && (
        <AuthStructure direction={direction} Content={Content} />
      )}
      {page === "EmailVerified" && (
        <AuthStructure direction={direction} Content={Content2} />
      )}
      {page === "alreadyVerified" && (
        <AuthStructure direction={direction} Content={Content3} />
      )}
    </>
  );
};

export default VerifyEmail;
