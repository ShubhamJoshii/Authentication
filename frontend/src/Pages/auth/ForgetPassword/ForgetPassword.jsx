import React, { useEffect, useState } from "react";
import AuthStructure from "../AuthStructure";
import { NavLink, useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import Github from "../../../assets/GitHub.png";
import FaceBook from "../../../assets/facebook.png";
import Google from "../../../assets/google.png";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../../../redux/reducer/userSlice";
import VerifyCode from "./VerifyCode";
import SetNewPassword from "./SetNewPassword";
import HashLoader from "react-spinners/HashLoader";

const Methods = [
  // {
  //   image:FaceBook,
  //   URL:"/auth/facebook"
  // },
  {
    image:Google,
    URL:"/auth/google"
  },
  {
    image:Github,
    URL:"/auth/github"
  },
]

const Content = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { data, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    reset({
      Email: data?.Email || "",
    });
  }, [data, reset]);
  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    dispatch(forgetPassword(data.Email));
  };

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
      <NavLink to={"/login"} id="backBtn">
        <HiOutlineChevronLeft />
        <p>Back to login</p>
      </NavLink>
      <h1>Forgot your password?</h1>
      <p>
        Don’t worry, happens to all of us. Enter your email below to recover
        your password
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          Text={"Email"}
          name={"Email"}
          type={"text"}
          errors={errors}
          {...register("Email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        <input type="submit" value="Submit" />
      </form>
      <p id="OtherMethods">Or login with</p>
      <div id="Methods">
        {Methods.map((curr, id) => {
          return (
            <a key={id} href={`.${curr.URL}`}>
              <img src={curr.image} alt={"MethodLogin"} />
            </a>
          );
        })}
      </div>
    </>
  );
};

const ForgetPassword = () => {
  const { forgetPasswordStage } = useSelector((state) => state.user);
  return (
    <>
      {forgetPasswordStage === "generateOTP" && (
        <AuthStructure Content={Content} />
      )}
      {forgetPasswordStage === "verifyOTP" && <VerifyCode />}
      {forgetPasswordStage === "SetNewPassword" && <SetNewPassword />}
    </>
  );
};

export default ForgetPassword;
