import React, { useState } from "react";
import logo from "../Images/ucf-logo.png";
import lock from "../Images/lock.png";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import validator from "validator";
import jwt from "jwt-decode";
import "./styles.css";

function ForgotPassword() {
  var email;
  var validationEmail;
  let history = useHistory();

  const [message, setMessage] = useState("");

  function validateEmail() {
    if (!email.value) {
      setMessage("Please enter an email.");
      return false;
    }

    if (!validator.isEmail(email.value)) {
      setMessage("Email is not valid!");
      return false;
    }
    return true;
  }

  const doConfirmEmail = async (event) => {
    event.preventDefault();

    validationEmail = validateEmail();

    if (!validationEmail) {
      return;
    }

    var obj = { email: email.value };
    var js = JSON.stringify(obj);

    console.log(js);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/forgotPasswordEmail",
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );

      var resp = JSON.parse(await response.text());

      console.log(resp);

      var data = jwt(resp.data);

      console.log(data);

      if (data.error) {
        setMessage(data.error);
      } else {
        var user = {
          id: data.userId,
        };
        localStorage.clear();
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/verifyForgotPasswordUser";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  return (
    <div id="forgotPasswordDiv">
      <nav
        className="navbar container-fluid"
        style={{ backgroundColor: "#FFC904" }}
      >
        <button className="back-button" onClick={() => history.goBack()}>
          Back
        </button>
      </nav>
      <div id="contentDiv" className="container-fluid text-center p-4">
        <div id="logoDiv">
          <img src={logo} alt="ucf-logo" className="logo" />
        </div>
        <h1 id="totsHeader" className="header-logo">
          TOP OF THE SCHEDULE
        </h1>
        <div id="lockDiv">
          <img
            src={lock}
            alt="lock"
            style={{
              borderRadius: 25,
              width: "8%",
            }}
          />
        </div>
        <h1 id="inner-title">Forgot Password?</h1>
        <form onSubmit={doConfirmEmail}>
          <label htmlFor="email" className="fonts">
            Email
          </label>
          <br />
          <input
            type="text"
            id="email"
            className="border-4 w-25 p-3 inputs"
            placeholder="Email"
            ref={(c) => (email = c)}
          />
          <br />
          <span id="forgotPasswordResult">{message}</span>
          <br />
          <button
            id="sendVerificationButton"
            type="submit"
            className="p-3 w-25 m-3 regular-button"
            onClick={doConfirmEmail}
          >
            Send Verification Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
