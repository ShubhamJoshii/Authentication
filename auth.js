const express = require("express");
const { UserModel, OTPModel } = require("./database");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const authMiddleware = require("./authMiddleware");
const Mailgen = require("mailgen");
const transporter = require("./util/transporter");
const verifyEmailMail = require("./util/verifyEmailMail");
const OTPMail = require("./util/OTPMail");
const env = process.env.NODE_ENV || "DEVELOPMENT";

class ValidationError extends Error {
  constructor(target, message) {
    super(message);
    this.target = target;
  }
}

router.get(`/home`, authMiddleware, async (req, res) => {
  if (req.rootUser) {
    res.send({ user: { ...req.rootUser._doc, Password: null }, success: true });
  } else {
    res.send({ success: false });
  }
});

router.post("/login", async (req, res) => {
  const { Email, Password, RememberMe } = req.body;
  try {
    const user = await UserModel.findOne(
      { Email, Provider:"local" },
      { LoginDate: 0, RegisterData: 0 }
    );
    if (!user) throw new ValidationError("Email", "Invalid credentials");
    if (!user.isVerified)
      throw new ValidationError(
        "Email",
        "Email not verified. Check your inbox or re-register"
      );

    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (isPasswordValid) {
      const Token = await user.generateAuthToken();
      if (RememberMe) {
        res.cookie("AuthToken", Token, {
          expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
      } else {
        res.cookie("AuthToken", Token, { httpOnly: true });
      }
      await user.save();
      return res.status(200).send({
        msg: "User Login Successfull",
        user: {
          ...user._doc,
          Password: null,
        },
        success: true,
      });
    } else {
      throw new ValidationError("Password", "Wrong Password");
    }
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

router.post("/register", async (req, res) => {
  const { Email, FirstName, LastName, Password, PhoneNumber } = req.body;

  const BASE_URL =
    env === "PRODUCTION"
      ? `https://${req.headers.host}/api`
      : "http://localhost:5000";
  let EmailToken = crypto.randomBytes(32).toString("hex");

  var VerfiedLink = `${BASE_URL}/verify-email?token=${EmailToken}`;

  try {
    await UserModel.deleteMany({ Email, isVerified: false });
    if (!Email || !FirstName || !LastName || !Password || !PhoneNumber)
      throw new ValidationError("All", "All fields are required");

    const userAlreadyExist = await UserModel.findOne({ Email });

    if (!userAlreadyExist) {
      const newUser = new UserModel({
        Email,
        FirstName,
        LastName,
        Password,
        EmailToken,
        PhoneNumber,
      });
      let message = {
        from: process.env.AUTH_EMAIL,
        to: Email,
        subject: "Let's complete your account setup",
        html: verifyEmailMail(FirstName + " " + LastName, VerfiedLink),
      };

      let temp = await newUser.save();
      await new Promise(async (resolve, reject) => {
        await transporter
          .sendMail(message)
          .then(() => {
            return res.send({
              msg: "Verification email sent",
              user: { ...req.body, _id: temp._doc._id },
              success: true,
            });
          })
          .catch(() => {
            return res.send({ msg: "Verification Error", success: false });
          });
      });
      return res.send({
        msg: "user registered successfully",
        user: { ...req.body, _id: temp._doc._id },
        success: true,
      });
    }
    // return res.status(400).send({ msg: "User already exists", success: false });
    throw new ValidationError("Email", "User already exists");
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

router.put("/resendOtp", async (req, res) => {
  const { _id } = req.body;
  const BASE_URL =
    env === "PRODUCTION"
      ? `https://${req.headers.host}/api`
      : "http://localhost:5000";

  try {
    const user = await UserModel.findOne({ _id });
    if (!user)
      throw new ValidationError("Email", "No User Found with such Email");
    if (user.isVerified)
      throw new ValidationError("Email", "Email is already verified.");
    var VerfiedLink = `${BASE_URL}/verify-email?token=${user.EmailToken}`;
    let message = {
      from: process.env.AUTH_EMAIL,
      to: user.Email,
      subject: "Let's complete your account setup",
      html: verifyEmailMail(user.FirstName + " " + user.LastName, VerfiedLink),
    };

    await new Promise(async (resolve, reject) => {
      await transporter
        .sendMail(message)
        .then(() => {
          return res.send({
            msg: "Verification email sent",
            success: true,
          });
        })
        .catch((err) => {
          return res.send({ msg: "Verification Error", success: false });
        });
    });
    throw new ValidationError("Email", "User already exists");
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

router.get(`/verify-email`, async (req, res) => {
  const redirectbaseURL =
    env === "PRODUCTION"
      ? `https://${req.headers.host}/api`
      : "http://localhost:3000";
  try {
    const token = req.query.token;
    const user = await UserModel.findOne({ EmailToken: token });
    if (user.isVerified) {
      // res.send("Email Already Verfied");
      return res.redirect(`${redirectbaseURL}/register?status=alreadyVerified`);
    }
    if (user) {
      // user.EmailToken = null;
      user.isVerified = true;
      await user.save();
      res.redirect(`${redirectbaseURL}/register?status=success`);
    }
  } catch (err) {
    res.redirect(`${redirectbaseURL}/register?status=failure`);
  }
});

router.get("/forgetPassword", async (req, res) => {
  const { Email } = req.query;
  try {
    const emailExist = await UserModel.findOne({ Email });
    if (!emailExist) throw new ValidationError("Email", "Invalid Email");
    if (!emailExist.isVerified)
      throw new ValidationError(
        "Email",
        "Email not verified. Check your inbox or re-register"
      );
    const otp = `${Math.floor(Math.random() * 90000) + 10000}`;
    const hashedOTP = await bcrypt.hash(otp, 12);
    const otpPreviousSave = await OTPModel.deleteMany({
      userID: emailExist._id,
    });
    const OTPSaveOnDB = new OTPModel({
      userID: emailExist._id,
      OTP: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    let message = {
      from: process.env.AUTH_EMAIL,
      to: Email,
      subject: "Forget Password Request",
      html: OTPMail(emailExist.FirstName + " " + emailExist.LastName, otp),
    };

    const otpsaved = await OTPSaveOnDB.save();
    await new Promise(async (resolve, reject) => {
      await transporter
        .sendMail(message)
        .then(() => {
          return res.send({
            msg: "OTP Mail sent",
            user: { otpID: otpsaved._id, Email },
            success: true,
          });
        })
        .catch(() => {
          throw new ValidationError("Email", "OTP sending Error");
          // return res.send({ msg: "OTP sending Error", success: false });
        });
    });
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

router.post("/verifyotp", async (req, res) => {
  const { otpID, Email, OTP } = req.body;
  try {
    const userExist = await UserModel.findOne({ Email });
    const userOTPFind = await OTPModel.findOne({ _id: otpID });
    const expiresAt = userOTPFind.expiresAt;
    const hashedOTP = userOTPFind.OTP;
    if (expiresAt < Date.now()) {
      await OTPModel.deleteMany({ userID: userExist._id });
      throw new ValidationError("All", "OTP is expired. Please request Again");
    } else {
      let validOTP = await bcrypt.compare(OTP, hashedOTP);
      if (validOTP) {
        return res.send({
          success: true,
          user: { Email: userExist.Email, _id: userExist._id },
          msg: "Valid OTP. Enter New Password",
        });
      } else {
        throw new ValidationError("All", "Invalid OTP. Please Try Again");
      }
    }
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
  }
});

router.post("/changePassword", async (req, res) => {
  const { Password, _id } = req.body;
  try {
    const userExist = await UserModel.findOne({ _id });
    if (!userExist) throw new ValidationError("Email", "Invalid credentials");
    await userExist.updateOne({ Password: await bcrypt.hash(Password, 12) });

    await userExist.save();
    res.send({ success: true, message: "Password Updated" });
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
    // res.send({ success: false, message: "Error Occurs! Please Try Again" });
  }
});

router.delete("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await UserModel.findOne({ _id });
    if (user.isVerified)
      return res.send({ success: true, message: "Password Updated" });
    const userDelete = await UserModel.deleteOne({ _id });
    if (!userDelete) throw new ValidationError("Email", "Invalid credentials");

    res.send({ success: true, message: "Password Updated" });
  } catch (error) {
    return res.status(400).send({
      msg: { message: error.message, target: error.target },
      success: false,
    });
    // res.send({ success: false, message: "Error Occurs! Please Try Again" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("AuthToken", { path: "/" });
  res.status(200).send({message:"User Logout",success:true});
});

module.exports = router;
