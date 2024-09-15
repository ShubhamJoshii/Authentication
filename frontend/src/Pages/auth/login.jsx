import React, { useEffect } from "react";
import AuthStructure from "./AuthStructure";
import Input from "../../components/Input";
import Github from "../../assets/GitHub.png";
import FaceBook from "../../assets/facebook.png";
import Google from "../../assets/google.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, updateUser } from "../../redux/reducer/userSlice";
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, error } = useSelector((state) => state.user);

  const onSubmit = async(data) => {
    console.log("Form data submitted:", data);
    let temp = await dispatch(loginUser(data));
    temp.payload.success && navigate("/");
  };

  useEffect(() => {
    reset({
      Email: data?.Email || "",
      Password: data?.Password || "",
    });
  }, [data, reset]);

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
      <h1>Login</h1>
      <p>Login to access your account</p>
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
        <Input
          Text={"Password"}
          name={"Password"}
          type={"password"}
          password={true}
          errors={errors}
          {...register("Password", { required: "Password is required" })}
        />
        <div id="ForgetAndRemember">
          <div>
            <input
              type="checkbox"
              name="RememberMe"
              id="RememberMe"
              {...register("RememberMe")}
            />
            <label htmlFor="RememberMe">Remember me</label>
          </div>
          <NavLink to={"/forgetpassword"} id="Forget">
            Forget Password
          </NavLink>
        </div>
        <input type="submit" value="Login" />
        <p id="HaveAccount">
          Don’t have an account? <NavLink to={"/register"}>Sign up</NavLink>
        </p>
      </form>
      <p id="OtherMethods">Or login with</p>
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

const Login = () => {
  return <AuthStructure Content={Content} />;
};

export default Login;
