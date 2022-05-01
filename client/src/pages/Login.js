import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Images/ucf-logo.png";
import "bootstrap/dist/css/bootstrap.css";
import validator from "validator";
import "./styles.css";
import axios from 'axios';

function Login() {
  let loginEmail;
  let loginPassword;

  let validationEmail;
  let validationPassword;

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

    let obj = { email: loginEmail.value, password: loginPassword.value };
    let js = JSON.stringify(obj);

    console.log("This is the request", js);


    axios.post(`${process.env.REACT_APP_API_URL}/api/login`, obj).then(async (res) => {
      console.log(res)
      // RESPONSE: { schedule: Array, sName: String }
      let body = res.data;
      console.log("this is the body for login", body);
      if (body.error)
      {
        console.log(body.error);
        setMessage(body.error);
        if (body.error === "User not verified, email sent")
        {
          // localStorage.clear();
          console.log(res.headers)
          let token = res.headers['x-token'];
          if (token == "null") alert('no token')
          localStorage.setItem('token', token);
          window.location.href = "/verifyRegisterUser";
        }
      }
      else
      {
        // localStorage.clear();
        console.log(localStorage)
        // console.log(res.headers)
        // res.headers.forEach(console.log);
        let token = res.headers['x-token'];
        if (token == "null") alert('no token')

        localStorage.setItem('token', token);
        setMessage("");
        if (body.schedule.length === 0)
        {
          window.location.href = "/flowchart";
        }
        else
        {
          window.location.href = "/displaySchedule";
        }
      }
    }).catch(err => {
      console.log(err)
      setMessage(err)
    })

    // try
    // {
    //   fetch(
    //     process.env.REACT_APP_API_URL + "/api/login",
    //     // "http://localhost:5000/api/login",
    //     {
    //       method: "POST",
    //       body: js,
    //       // mode: 'cors',
    //       // credentials: 'include',
    //       headers: { "Content-Type": "application/json" }
    //     }
    //   ).then(async res=>
    //   {
        // // RESPONSE: { schedule: Array, sName: String }
        // let body = await res.json();
        // console.log("this is the body for login", body);
        // if (body.error)
        // {
        //   console.log(body.error);
        //   setMessage(body.error);
        //   if (body.error === "User not verified, email sent")
        //   {
        //     // localStorage.clear();
        //     console.log(res.headers)
        //     let token = res.headers.get('X-Token');
        //     if (token == "null") alert('no token')
        //     localStorage.setItem('token', token);
        //     window.location.href = "/verifyRegisterUser";
        //   }
        // }
        // else
        // {
        //   // localStorage.clear();
        //   console.log(localStorage)
        //   // console.log(res.headers)
        //   res.headers.forEach(console.log);
        //   let token = res.headers.get('X-Token');
        //   if (token == "null") alert('no token')

        //   localStorage.setItem('token', token);
        //   setMessage("");
        //   if (body.schedule.length === 0)
        //   {
        //     window.location.href = "/flowchart";
        //   }
        //   else
        //   {
        //     window.location.href = "/displaySchedule";
        //   }
        // }
    //   }).catch(err => {
    //     setMessage(err)
    //   });

    //   // -- logout --
    //   // localStorage.removeItem("token")
    //   // window.location.href = "/byebye" || "/sayounara" || "/";

    // } catch (e) {
    //   console.log(e.toString());
    //   return;
    // }
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
          Don't have an account?&nbsp;
          <span id=" Register" style={{ textDecoration: "underline" }}>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </form>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
