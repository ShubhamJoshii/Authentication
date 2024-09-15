import React from "react";
import AuthStructure from "../AuthStructure";
import { NavLink } from "react-router-dom";

import Input from "../../../components/Input";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  changeForgetPasswordStage,
  forgetPassword,
  verifyOTPCode,
} from "../../../redux/reducer/userSlice";

import HashLoader from "react-spinners/HashLoader";

const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(data);
  const onSubmit = (d) => {
    console.log("Form data submitted:", d);
    dispatch(
      verifyOTPCode({ otpID: data.otpID, Email: data.Email, OTP: d.VerifyCode })
    );
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
      <h1>Verify code</h1>
      <p>An authentication code has been sent to your email.</p>
      <div id="emailVerify">
        <span
          onClick={() => dispatch(changeForgetPasswordStage("generateOTP"))}
        >
          (edit)
        </span>
        <span>{data.Email}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          Text={"Enter Code"}
          name={"VerifyCode"}
          type={"text"}
          errors={errors}
          {...register("VerifyCode", {
            required: "Verification Code is required",
          })}
        />
        <p id="Resend">
          Didn’t receive a code?{" "}
          <button onClick={() => dispatch(forgetPassword(data.Email))}>
            Resend
          </button>
        </p>
        <input type="submit" value="Verify" />
      </form>
    </>
  );
};

const VerifyCode = () => {
  return <AuthStructure Content={Content} />;
};

export default VerifyCode;
