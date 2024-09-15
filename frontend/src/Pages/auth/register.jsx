import React, { useEffect } from "react";
import AuthStructure from "./AuthStructure";
import Input from "../../components/Input";
import Github from "../../assets/GitHub.png";
import FaceBook from "../../assets/facebook.png";
import Google from "../../assets/google.png";
import { NavLink, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { registerUser, updatePage } from "../../redux/reducer/userSlice";
import VerifyEmail from "./verifyEmail";
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
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    const verificationStatus = query.get("status");
    dispatch(updatePage(verificationStatus));
  }, [query]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data, status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    reset({
      FirstName: data?.FirstName || "",
      LastName: data?.LastName || "",
      Email: data?.Email || "",
      PhoneNumber: data?.PhoneNumber || "",
      Password: data?.Password || "",
      ConfirmPassword: data?.ConfirmPassword || "",
    });
  }, [reset, data]);

  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    dispatch(registerUser(data));
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
      <h1>Sign up</h1>
      <p>Let’s get you all st up so you can access your personal account.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div id="inputCollection">
          <Input
            Text={"First Name"}
            name={"FirstName"}
            type={"text"}
            errors={errors}
            {...register("FirstName", {
              required: "First Name is required",
            })}
          />
          <Input
            Text={"Last Name"}
            name={"LastName"}
            type={"text"}
            errors={errors}
            {...register("LastName", {
              required: "LastName is required",
            })}
          />
        </div>
        <div id="inputCollection">
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
          {error?.target === "Email" && <p>{error.text}</p>}
          <Input
            Text={"Phone Number"}
            name={"PhoneNumber"}
            type={"text"}
            errors={errors}
            {...register("PhoneNumber", {
              required: "Phone Number is required",
            })}
          />
        </div>
        <Input
          Text={"Password"}
          name={"Password"}
          type={"password"}
          password={true}
          errors={errors}
          {...register("Password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            validate: {
              hasUppercase: (value) =>
                /[A-Z]/.test(value) ||
                "Password must contain at least one uppercase letter",
              hasNumber: (value) =>
                /[0-9]/.test(value) ||
                "Password must contain at least one number",
              hasSpecialChar: (value) =>
                /[!@#$%^&*]/.test(value) ||
                "Password must contain at least one special character (!@#$%^&*)",
            },
          })}
        />
        <Input
          Text={"Confirm Password"}
          name={"ConfirmPassword"}
          type={"password"}
          password={true}
          errors={errors}
          {...register("ConfirmPassword", {
            required: "Please confirm your password",
            validate: (value, { Password }) =>
              value === Password || "Passwords do not match",
          })}
        />
        <div id="TermAndCondition">
          <input
            type="checkbox"
            name="TermCondition"
            id="TermCondition"
            required
            {...register("TermCondition")}
          />
          <label htmlFor="TermCondition">
            I agree to all the{" "}
            <NavLink to={"/register"} id="Forget">
              Terms
            </NavLink>{" "}
            and{" "}
            <NavLink to={"/register"} id="Forget">
              {" "}
              Privacy Policies
            </NavLink>
          </label>
        </div>
        <input type="submit" value="Create account" />
        <p id="HaveAccount">
          Already have an account? <NavLink to={"/login"}>Login</NavLink>
        </p>
      </form>
      <p id="OtherMethods">Or Sign up with</p>
      <div id="Methods">
        {Methods.map((curr, id) => {
          return (
            <a key={id} href={`http://localhost:5000${curr.URL}`}>
              <img src={curr.image} alt={"MethodLogin"} />
            </a>
          );
        })}
      </div>
    </>
  );
};

const Register = () => {
  const { page } = useSelector((state) => state.user);
  return (
    <>
      {page !== "SendedVerificationMail" &&
      page !== "EmailVerified" &&
      page !== "alreadyVerified" ? (
        <AuthStructure direction={true} Content={Content} />
      ) : (
        <VerifyEmail direction={true} />
      )}
    </>
  );
};

export default Register;
