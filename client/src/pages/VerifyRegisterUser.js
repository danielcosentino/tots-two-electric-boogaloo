import React, { useState } from "react";
import logo from "../Images/ucf-logo.png";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import jwt from "jwt-decode";

function VerifyRegisterUser() {
  var verificationCode;
  var validationVerificationCode;
  let _user = localStorage.getItem("user_data");
  let user = JSON.parse(_user);
  console.log(user.id);

  const [message, setMessage] = useState("");

  let history = useHistory();

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

    let obj = { userId: user.id, verifCode: verificationCode.value };
    let js = JSON.stringify(obj);

    console.log(js);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/verifyUser",
        {
          method: "POST",
          body: js,
          headers: { "Content-type": "application/json" },
        }
      );

      let data = JSON.parse(await response.text());

      console.log(data);

      if (data.error) {
        setMessage(data.error);
      } else {
        let user = {
          id: data.userId,
        };
        localStorage.clear();
        localStorage.setItem("user_data", JSON.stringify(user));
        console.log(JSON.parse(localStorage.getItem("user_data")).id);
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  return (
    <div id="verifyRegisterUserDiv">
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
          <img
            src={logo}
            alt="ucf-logo"
            style={{
              borderRadius: 25,
              width: "10%",
            }}
          />
        </div>
        <h1
          id="totsHeader"
          style={{
            color: "#FFC904",
          }}
        >
          TOP OF THE SCHEDULE
        </h1>
        <h1 id="inner-title">Verify User</h1>
        <form onSubmit={doVerify}>
          <label
            htmlFor="verificationCode"
            style={{
              fontSize: 24,
            }}
          >
            Enter the 4 digit code you received in your email
          </label>
          <br />
          <input
            type="password"
            id="verificationCode"
            className="border-4 w-25 p-3"
            style={{
              borderColor: "#FFC904",
              borderRadius: 25,
            }}
            placeholder="Verification Code"
            ref={(c) => (verificationCode = c)}
          />
          <br />
          <span id="verificationCodeSpan" className="text-danger">
            {message}
          </span>
          <br />
          <button
            id="verifyUserButton"
            type="submit"
            className="p-3 w-25 m-3"
            style={{
              borderRadius: 25,
              backgroundColor: "#FFC904",
              fontSize: 24,
            }}
            onClick={doVerify}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyRegisterUser;
