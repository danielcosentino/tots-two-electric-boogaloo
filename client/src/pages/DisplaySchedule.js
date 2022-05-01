import React, { useEffect, useState } from "react";
import logo from "../Images/ucf-logo.png";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

function DisplaySchedule()
{
  console.log("entering displayschedule");

  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState([]);

  let history = useHistory();

  useEffect(() => {
    console.log('get')
    try
    {
      fetch(
        process.env.REACT_APP_API_URL + "/api/getSchedule",
        // "http://localhost:5000/api/login",
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
          mode: "cors"
        }
      ).then(async res=>
      {
        // RESPONSE: { schedule: Array, sName: String }
        let body = await res.json();
        if (body.error)
        {
          // setMessage(body.error);
  
          // if there is no schedule
          if (body.error === "Invalid request: no userId"
           || body.error === "User not found")
          {
            localStorage.clear();
            window.location.href = "/login";
          }
          else // if the user does not have a schedule yet
          {
            window.location.href = "/flowchart";
          }
        }
        else // if schedule was accessed
        {
          if (body.schedule.length === 0)
          {
            window.location.href = "/flowchart";
          }
          else
          {
            console.log("before: ", schedule);
            setSchedule(body.schedule);
            console.log("after: ", schedule);
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
  }, [])


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
          // <table class="w-100 table table-bordered table-dark">
          <table className="w-100 table table-bordered">
            <thead>
              <tr key={i} className="table-header">
                <th>Semester {i + 1}</th>
              </tr>
            </thead>
            <tbody class="table-row">
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
