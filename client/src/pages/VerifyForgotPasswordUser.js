import React, { useState } from "react";
import logo from "../Images/ucf-logo.png";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

function VerifyForgotPasswordUser() {
  let verificationCode;
  let validationVerificationCode;
  let history = useHistory();

  const [message, setMessage] = useState("");

  function validateVerificationCode() {
    if (verificationCode.value === "") {
      setMessage("Please enter a verification code.");
      return false;
    }

    if (verificationCode.value.length !== 4) {
      setMessage("Verfication Code must be 4 characters long.");
      return false;
    }

    return true;
  }

  const doVerify = async (event) => {
    event.preventDefault();

    validationVerificationCode = validateVerificationCode();
    if (!validationVerificationCode) {
      return;
    }


    let obj = { verifCode: verificationCode.value };
    let js = JSON.stringify(obj);

    console.log(js);

    try {
      fetch(
        process.env.REACT_APP_API_URL + "/api/verifyForgotPassword",
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
        }
      ).then(async res=>
      {
        let body = await res.json();

        if (res.status !== 200)
        {
          setMessage(body.error);
        }
        else
        {
          window.location.href = "/resetPassword";
        }
      }).catch(err => 
      {
        setMessage(err)
      });
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  return (
    <div id="verifyForgotPasswordUserDiv">
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
        <h1 id="inner-title">Verify User</h1>
        <form onSubmit={doVerify}>
          <label htmlFor="verificationCode" className="fonts">
            Enter the 4 digit code you received in your email
          </label>
          <br />
          <br />
          <input
            type="password"
            id="verificationCode"
            className="border-4 w-25 p-3 inputs"
            placeholder="Verification Code"
            ref={(c) => (verificationCode = c)}
          />
          <br />
          <span id="verifyForgotPasswordResult" className="text-danger">
            {message}
          </span>
          <br />
          <button
            id="verifyUserButton"
            type="submit"
            className="p-3 w-25 m-3 regular-button"
            onClick={doVerify}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyForgotPasswordUser;
