import React, { useState } from "react";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";
import logo from "../Images/ucf-logo.png";
import "bootstrap/dist/css/bootstrap.css";
import validator from "validator";
import "./styles.css";

function Login() {
  var loginEmail;
  var loginPassword;

  var validationEmail;
  var validationPassword;

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [message, setMessage] = useState("");

  function validateEmail(email) {
    if (!email.value) {
      setEmailMessage("Please enter an email.");
      return false;
    }

    if (!validator.isEmail(email.value)) {
      setEmailMessage("Email is not valid!");
      return false;
    }
    return true;
  }

  function validatePassword(password) {
    if (!password.value) {
      setPasswordMessage("Please enter a password.");
      return false;
    }

    if (password.value.length < 6) {
      setPasswordMessage("Password should be 6 characters long.");
      return false;
    }
    return true;
  }

  const doLogin = async (event) => {
    event.preventDefault();

    setEmailMessage("");
    setPasswordMessage("");
    setMessage("");

    validationEmail = validateEmail(loginEmail);
    validationPassword = validatePassword(loginPassword);

    if (!validationEmail || !validationPassword) {
      return;
    }

    var obj = { email: loginEmail.value, password: loginPassword.value };
    var js = JSON.stringify(obj);

    console.log(js);

    try {
      fetch(
        // process.env.REACT_APP_API_URL + "/api/verifyUser",
        process.env.REACT_APP_API_URL + "/api/login",
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        }
      ).then(async res=> {

        let body = await res.json();

        if (!body.verified) {
          setMessage("user not verfied")
        }
        else {
          let token = res.headers.get('X-Token');

          localStorage.setItem('token', token);
  
          setMessage("You have logged in.");
        }
      }).catch(err => {
        setMessage(err)
      });

      // logout
      // localStorage.removeItem("token")


      // let resp = JSON.parse(await response.text());
      // let resp = await response.json();

      // console.log(response.headers.get("X-Token"));

    


      // var data = jwt(resp.data);

      // console.log(data);

      // var user = {
      //   id: data.userId,
      // };
      // localStorage.setItem("user_data", JSON.stringify(user));

      // if (data.error) {
      //   setMessage(data.error);
      //   if (data.error === "User not verified") {
      //     setMessage(data.error);
      //   }
      // } else {
      //   setMessage("You have logged in.");
      // }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  return (
    <div id="loginDiv" className="container-fluid text-center pt-2">
      <div id="logoDiv">
        <img src={logo} alt="ucf-logo" className="logo" />
      </div>
      <h1 id="totsHeader" className="header-logo">
        TOP OF THE SCHEDULE
      </h1>
      <h1 id="inner-title">Login</h1>
      <form onSubmit={doLogin}>
        <label htmlFor="loginEmail" className="fonts">
          Email
        </label>
        <br />
        <input
          type="text"
          id="loginEmail"
          className="border-4 w-25 p-3 inputs"
          placeholder="Email"
          ref={(c) => (loginEmail = c)}
        />
        <br />
        <span id="emailMessageSpan" className="text-danger">
          {emailMessage}
        </span>
        <br />
        <label htmlFor="loginPassword" className="fonts">
          Password
        </label>
        <br />
        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          className="border-4 w-25 p-3 inputs"
          ref={(c) => (loginPassword = c)}
        />
        <br />
        <span id="passwordMessageSpan" className="text-danger">
          {passwordMessage}
        </span>
        <br />
        <div
          style={{
            fontSize: 24,
            textDecoration: "underline",
          }}
        >
          <Link to="/forgotPassword">Forgot Password?</Link>
        </div>
        <button
          id="loginButton"
          type="submit"
          className="p-3 w-25 m-3 regular-button"
          onClick={doLogin}
        >
          Login
        </button>
        <div id="redirectRegister" className="fonts">
          Don't have an acccount?
          <span id="Register" style={{ textDecoration: "underline" }}>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </form>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
