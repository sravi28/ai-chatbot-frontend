import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "@/components/chat";
import Login from "@/components/login";
import "./App.css";

// Otp Imports
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "@/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState("");
  const [secret, setSecret] = useState(null);
  const isAuth = Boolean(user) && Boolean(secret);

  // OTP Verifiaction
  const [otp, setOtp] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + number;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setVerified(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  const isUser = Boolean(verified);
  console.log(verified);

  return (
    <div className="main-container">
      {!isUser ? (
        <div className="app">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  isAuth ? (
                    <Navigate to="/chat" />
                  ) : (
                    <Login setUser={setUser} setSecret={setSecret} />
                  )
                }
              />
              <Route
                path="/chat"
                element={
                  isAuth ? (
                    <Chat user={user} secret={secret} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <section className="App-container">
          <div>
            <Toaster toastOptions={{ duration: 4000 }} />
            <div id="recaptcha-container"></div>
            <div className="otp-container">
              <h1 className="otp-title">Welcome to Chat-Bot</h1>
              {showOTP ? (
                <>
                  <div className="shield-logo">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <label htmlFor="otp" className="otp-text">
                    Enter your OTP
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container "
                  ></OtpInput>
                  <button onClick={onOTPVerify} className="Otp-submit-btn">
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="phone">
                    <BsTelephoneFill size={30} />
                  </div>
                  <label htmlFor="" className="phone-title">
                    Verify your phone number
                  </label>
                  <PhoneInput
                    className="drop"
                    country={"in"}
                    value={number}
                    onChange={setNumber}
                  />
                  <button onClick={onSignup} className="btn-otp">
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Send code via SMS</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
