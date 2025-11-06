import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ButtonCopy";
import Input from "../../components/Input/Input";
import ModalError from "../../components/ModalErrorAuth/ModalError";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import "./Auth.css";

import type { UserType } from "../../types/userType";

import { auth } from "../../services/firebaseConfig";
import { db } from "../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { setDoc, doc } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation state in Firebase
  const [meetsMinPasswordLength, setMeetsMinPasswordLength] = useState<
    boolean | undefined
  >(false);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "login" || urlMode === "signup") {
      setMode(urlMode);
    }
  }, [searchParams]);

  // Validate password whenever it changes
  useEffect(() => {
    if (password === "") {
      setMeetsMinPasswordLength(false);
      return;
    }
    const checkPassword = async () => {
      try {
        const status = await validatePassword(auth, password);
        setMeetsMinPasswordLength(status.meetsMinPasswordLength);
      } catch {
        setMeetsMinPasswordLength(false);
      }
    };
    checkPassword();
  }, [password]);

  const isPasswordValid = meetsMinPasswordLength === true;

  // Función que maneja el registro/login y está en el botón de enviar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!isPasswordValid) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "login") {
      // Login
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userID = userCredential.user.uid;
        dispatch(setUser(userID));
        navigate("/pet-type");
      } catch (error) {
        const err = error as FirebaseError;
        if (
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/invalid-credential"
        ) {
          setModalMessage("Ops! User and password don't match.");
          setModalVisible(true);
        } else {
          setErrorMessage(err.message || "Login Error.");
        }
        console.error(err);
      }
    } else {
      // Signup
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userID = userCredential.user.uid;
        dispatch(setUser(userID));

        const newUser: UserType = {
          id: userID,
          name,
          phoneNumber: phone,
          email,
        };

        await setDoc(doc(db, "users", userID), newUser);

        navigate("/pet-type");
      } catch (error) {
        const err = error as FirebaseError;
        setErrorMessage(err.message || "Registration Error.");
        console.error(err);
      }
    }

    setIsSubmitting(false);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      {isSubmitting && (
        <LoadingScreen
          text={
            mode === "login"
              ? "Logging in..."
              : "Hold on! we are creating your account..."
          }
        />
      )}
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-logo">
            <img
              src="/images/Logo.png"
              alt="Fellow Logo"
              className="auth-logo-img"
            />
          </div>

          <div className="auth-header">
            <button className="back-button" onClick={handleBackClick}>
              ← Back
            </button>
          </div>

          <div className="auth-toggle">
            <button
              className={`toggle-button ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
              disabled={isSubmitting}
            >
              Login
            </button>
            <button
              className={`toggle-button ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <h1 className="auth-title">
              {mode === "login" ? "Welcome Back" : "Welcome to Fellow"}
            </h1>

            {mode === "signup" && (
              <>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={setName}
                  required
                  disabled={isSubmitting}
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  required
                  disabled={isSubmitting}
                />
              </>
            )}

            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={setEmail}
              required
              disabled={isSubmitting}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              required
              disabled={isSubmitting}
            />
            {!meetsMinPasswordLength && password.length > 0 && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Insufficient password (min 6 characters).
              </p>
            )}

            {errorMessage && (
              <p className="auth-error" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}

            <Button
              variant="primary"
              text={mode === "login" ? "Login" : "Register"}
              onClick={() => {}}
              disabled={isSubmitting}
            />
          </form>

          <ModalError
            open={modalVisible}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Auth;
