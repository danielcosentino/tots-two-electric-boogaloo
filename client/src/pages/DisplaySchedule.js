import React, { useState } from "react";
import logo from "../Images/ucf-logo.png";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

function DisplaySchedule()
{
  let schedule;

  const [message, setMessage] = useState("");

  let history = useHistory();

  schedule = [
    {
      semester: ["MAC2311", "COP3223", "STA2023", "GEP1"],
    },
    {
      semester: ["GEP2", "GEP3"],
    },
    {
      semester: ["COP3330", "COP3502", "MAC2312", "GEP4"],
    },
    {
      semester: ["COP3503", "COT3960", "CDA3103", "CIS3360", "PHY2048"],
    },
    {
      semester: ["GEP5", "GEP6"],
    },
    {
      semester: ["CAP4630", "COP4020", "COP3402", "PHY2049"],
    },
    {
      semester: ["CAP4145", "CAP5725", "COT4210", "BSC2010"],
    },
    {
      semester: ["GEP9", "GEP10"],
    },
    {
      semester: ["CAP5510", "CAP4053", "COP4331", "ENC3241"],
    },
    {
      semester: [
        "COP4934",
        "Math/Science Elective",
        "Math/Science Elective",
        "Math/Science Elective",
      ],
    },
    {
      semester: ["COP4935"],
    },
  ];



  try
  {
    fetch(
      process.env.REACT_APP_API_URL + "/api/getSchedule",
      // "http://localhost:5000/api/login",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors"
      }
    ).then(async res=>
    {
      // RESPONSE: { schedule: Array, sName: String }
      let body = await res.json();
      if (body.error)
      {
        setMessage(body.error);
        if (body.error === "User not verified, email sent")
        {
          localStorage.clear();
          let token = res.headers.get('X-Token');
          localStorage.setItem('token', token);
          window.location.href = "/verifyRegisterUser";
        }
      }
      else
      {
        localStorage.clear();
        let token = res.headers.get('X-Token');
        localStorage.setItem('token', token);
        setMessage("Welcome, " + body.sName + "!");
        if (body.schedule.length === 0)
        {
          window.location.href = "/flowchart";
        }
        else
        {
          window.location.href = "/displaySchedule";
        }
      }
    }).catch(err =>
    {
      setMessage(err)
    });
  }
  catch (e)
  {
    console.log(e.toString());
    return;
  };

  return (
    <div id="displayScheduleDiv" class="text-center">
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
        {schedule.map((sems, i) => (
          <table class="w-100 table table-bordered table-dark">
            <thead>
              <tr key={i}>
                <th>Semester {i + 1}</th>
              </tr>
            </thead>
            <tbody>
              {sems.semester.map((x, j) => (
                <tr>
                  <td key={j}>{x}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

export default DisplaySchedule;
