const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;

mongoose
  .connect("mongodb://localhost:27017/")
  .then((result) => {
    console.log("DataBase Connection Successfull");
  })
  .catch((err) => {
    console.log("DataBase Connection UnSuccessfull");
  });

const UserSchema = new mongoose.Schema({
  
  FirstName: {
    type: String,
    require: true,
  },
  LastName: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  PhoneNumber: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: false,
  },
  EmailToken: {
    type: String,
    require: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
    require: true,
  },
  Tokens: [
    {
      Token: {
        type: String,
        require: true,
      },
    },
  ],
  RegisterData: {
    type: Date,
    default: Date.now(),
  },
  LoginDate: [
    {
      type: String,
      require: true,
    },
  ],
  GoogleId: {
    type: String, // Stores Google user ID
    required: false,
  },
  FacebookId: {
    type: String, // Stores Facebook user ID
    required: false,
  },
  GitHubId: {
    type: String, // Stores GitHub user ID
    required: false,
  },
  Provider: {
    type: String,
    default:"local",
    required: false,
  },
});

const OTPVerification = new mongoose.Schema({
  userID: String,
  OTP: String,
  createdAt: Date,
  expiresAt: Date,
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 12);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  try {
    let Token = jwt.sign({ _id: this._id }, SECRET_KEY);
    this.Tokens = this.Tokens.concat({ Token: Token });
    await this.save();
    return Token;
  } catch (err) {
    console.log(err);
  }
};

const UserModel = mongoose.model("Users", UserSchema);
const OTPModel = mongoose.model("OTPs", OTPVerification);

module.exports = { UserModel, OTPModel };
