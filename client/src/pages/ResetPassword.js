import React, { useState } from "react";
import logo from "../Images/ucf-logo.png";
import { useHistory } from "react-router-dom";
import jwt from "jwt-decode";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

function ResetPassword() {
  var newPassword;
  var confirmNewPassword;
  var validationNewPassword;
  var validationConfirmNewPassword;

  const [newPasswordMessage, setNewPasswordMessage] = useState("");
  const [confirmNewPasswordMessage, setConfirmNewPasswordMessage] =
    useState("");
  const [message, setMessage] = useState("");

  let history = useHistory();

  function validateNewPassword() {
    if (newPassword.value === "") {
      setNewPasswordMessage("Please enter a new password.");
      return false;
    }

    if (newPassword.value.length < 6) {
      setNewPasswordMessage("Password must be 6 characters long.");
      return false;
    }
    return true;
  }

  function validateConfirmNewPassword() {
    if (confirmNewPassword.value === "") {
      setConfirmNewPasswordMessage("Please enter a new password.");
      return false;
    }

    if (confirmNewPassword.value.length < 6) {
      setConfirmNewPasswordMessage("Password must be 6 characters long.");
      return false;
    }

    if (newPassword.value !== confirmNewPassword.value) {
      setConfirmNewPasswordMessage("Passwords should match.");
      return false;
    }

    return true;
  }

  const doReset = async (event) => {
    event.preventDefault();

    setMessage("");
    setNewPasswordMessage("");
    setConfirmNewPasswordMessage("");

    validationNewPassword = validateNewPassword();
    validationConfirmNewPassword = validateConfirmNewPassword();

    if (!validationNewPassword || !validationConfirmNewPassword) {
      return;
    }

    let user = JSON.parse(localStorage.getItem("user_data"));

    var obj = { userId: user.id, password: newPassword.value };
    var js = JSON.stringify(obj);
    console.log(js);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/resetPassword",
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        }
      );

      let resp = JSON.parse(await response.text());
      console.log(resp);

      let data = jwt(resp.data);
      console.log(data);

      if (data.error) {
        setMessage(data.error);
      } else {
        let user = {
          id: data.userId,
        };
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  return (
    <div id="resetPasswordDiv">
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
        <label htmlFor="resetNewPassword" className="fonts">
          New Password
        </label>
        <br />
        <form onSubmit={doReset}>
          <input
            type="password"
            id="resetNewPassword"
            className="border-4 w-25 p-3 inputs"
            placeholder="Password"
            ref={(c) => (newPassword = c)}
          />
          <br />
          <span id="passwordMessageSpan" className="text-danger">
            {newPasswordMessage}
          </span>
          <br />
          <label htmlFor="resetConfirmPassword" className="fonts">
            Confirm New Password
          </label>
          <br />
          <input
            type="password"
            id="resetConfirmPassword"
            className="border-4 w-25 p-3 inputs"
            placeholder="Confirm Password"
            ref={(c) => (confirmNewPassword = c)}
          />
          <br />
          <span id="confirmPasswordMessageSpan" className="text-danger">
            {confirmNewPasswordMessage}
          </span>
          <br />
          <button
            id="resetButton"
            type="submit"
            className="p-3 w-25 m-3 regular-button"
            onClick={doReset}
          >
            Reset Password
          </button>
        </form>
        <span id="resetPasswordResult">{message}</span>
      </div>
    </div>
  );
}

export default ResetPassword;
