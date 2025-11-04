import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ButtonCopy";
import Input from "../../components/Input/Input";
import "./Auth.css";

import { auth } from "../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "login" || urlMode === "signup") {
      setMode(urlMode);
    }
  }, [searchParams]);

  const isPasswordValid = password.length >= 6; // Validación mínima para Firebase

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!isPasswordValid) {
      setErrorMessage("Contraseña debe tener al menos 6 caracteres.");
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
        setErrorMessage(err.message || "Error en login.");
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
        // Aquí podrías guardar name y phone en el perfil o BD si quieres
        navigate("/pet-type");
      } catch (error) {
        const err = error as FirebaseError;
        setErrorMessage(err.message || "Error en registro.");
        console.error(err);
      }
    }

    setIsSubmitting(false);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
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
      </div>
    </div>
  );
};

export default Auth;
