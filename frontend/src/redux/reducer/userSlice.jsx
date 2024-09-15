import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await axios.get("/api/home");
  return response.data.user;
});

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/register", { ...data });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/login", { ...data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (Email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/forgetPassword?Email=${Email}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/resendOtp`,{_id});
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOTPCode = createAsyncThunk(
  "user/verifyOTPCode",
  async ({ otpID, Email, OTP }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/verifyotp`, {
        otpID,
        Email,
        OTP,
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ Password, _id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/changePassword`, {
        Password,
        _id,
      });
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (_id, { rejectWithValue }) => {
    // console.log(_id)
    try {
      const response = await axios.delete(`/api/user/${_id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/logout")
      console.log(response);
      return null;
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
    status: "idle",
    page: "",
    forgetPasswordStage: "generateOTP",
    error: null,
  },
  reducers: {
    updateUser(state, action) {},
    changeForgetPasswordStage(state, action) {
      state.forgetPasswordStage = action.payload;
    },
    updatePage(state, action) {
      if (action.payload === "success") {
        state.page = "EmailVerified";
      } else if (action.payload === "alreadyVerified") {
        state.page = "alreadyVerified";
      } else {
        state.page = null;
      }
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.status = "loading";
    };

    const handleFulfilled = (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.data = action.payload;
    };

    const handleRejected = (state, action) => {
      state.status = "failed";
      state.error = action.payload?.msg;
    };

    builder
      .addCase(fetchUser.pending, handlePending)
      .addCase(fetchUser.fulfilled, handleFulfilled)
      .addCase(fetchUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.page = "SendedVerificationMail";
        state.error = null;
        state.status = "succeeded";
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(forgetPassword.pending, handlePending)
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
        state.forgetPasswordStage = "verifyOTP";
      })
      .addCase(forgetPassword.rejected, handleRejected)
      .addCase(verifyOTPCode.pending, handlePending)
      .addCase(verifyOTPCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        action.payload && (state.data = action.payload);
        action.payload && (state.forgetPasswordStage = "SetNewPassword");
      })
      .addCase(verifyOTPCode.rejected, handleRejected)
      .addCase(changePassword.pending, handlePending)
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(changePassword.rejected, handleRejected)
      .addCase(deleteUser.rejected, handleRejected)
      .addCase(deleteUser.pending, handlePending)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload && (state.page = null);
      })
      .addCase(logoutUser.rejected, handleRejected)
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, handleFulfilled)
      .addCase(resendOtp.rejected, handleRejected)
      .addCase(resendOtp.pending, handlePending)
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = {message:action.payload.msg, target:"OTP"}
      })
  },
});

export default userSlice.reducer;
export const { updateUser, updatePage, changeForgetPasswordStage } =
  userSlice.actions;
