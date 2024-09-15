import React, { useEffect } from "react";
import AuthStructure from "../AuthStructure";
import Input from "../../../components/Input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../redux/reducer/userSlice";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { data, status } = useSelector((state) => state.user);
  useEffect(() => {
    reset({
      _id: data?._id || "",
      Email: data?.Email || "",
    });
  }, [reset, data]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async(data) => {
    let temp = await dispatch(changePassword({ Password: data.Password, _id: data._id }));
    temp && navigate("/login")
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
      <h1>Set a password</h1>
      <p>
        Your previous password has been reseted. Please set a new password for
        your account.
      </p>
      <div id="emailVerify">
        <span>{data.Email}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          Text={"Create Password"}
          name={"Password"}
          type={"password"}
          errors={errors}
          password={true}
          {...register("Password", {
            required: "Password is required",
          })}
        />
        <Input
          Text={"Re-enter Password"}
          name={"ConfirmPassword"}
          type={"password"}
          password={true}
          errors={errors}
          {...register("ConfirmPassword", {
            required: "Confirm Password is required",
          })}
        />
        <input type="submit" value="Set password" />
      </form>
    </>
  );
};

const SetNewPassword = () => {
  return <AuthStructure Content={Content} />;
};

export default SetNewPassword;
