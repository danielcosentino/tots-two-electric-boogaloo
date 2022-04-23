const express = require("express");
const path = require("path");
const generatePassword = require("password-generator");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const User = require("./model/user");
const Class = require("./model/class");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
const app = express();

require("dotenv").config();

if (process.env.ENV_CHECKER == "true")
  console.log("The env file is hooked up");
else 
{
  console.log(
    "ERROR ERROR ERROR ERROR\nThe env is NOT hooked up\nERROR ERROR ERROR ERROR"
  );
}

// TODO: Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
mongoose.connect(process.env.MONGO_CONNECTION_STRING, 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(bodyParser.json());
app.use(
  session(
    {
    secret: "foo",
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_STRING,

      // time in seconds that session will expire
      ttl: 30 * 60,
    }),
    resave: true,
    saveUninitialized: true,
  })
);
sgMail.setApiKey(process.env.REGISTER_AUTH_KEY);

// generates a random verificationCode
function makeVerifCode() 
{
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// sorts by postreqs
function classCompare(classA, classB)
{
  if (!classA.compPostReqs && !classB.compPostReqs)
    return 0;

  // if b has no postreqs
  if (!classB.compPostReqs)
    return -1;
    
  // if a has no postreqs
  if (!classA.compPostReqs)
    return 1;

  if (classA.compPostReqs.length > classB.compPostReqs.length)
    return -1;

  if (classA.compPostReqs.length < classB.compPostReqs.length)
    return 1;

  // a must be equal to b
  return 0;
}

// Turn a class object array into a class id array
function nerfer(classArr) 
{
  let idsOnly = []; 
  for (let i = 0; i < classArr.length; i++) 
    idsOnly.push(classArr[i].classId);

  return idsOnly; 
}

// Turns class strings into objects
async function unNerfer(idList) 
{
  const len = idList.length; 

  let classObjArr = [];
  let curClass;

  for (let i = 0; i < len; i++) 
  {
    // If alreay an object, add to list as is
    if (idList[i].classId)
    {
      classObjArr.push(idList[i]);
    }
    // Else grab class from database
    else
    {
      curClass = await Class.findOne({ classId : idList[i] }).lean();
      classObjArr.push(curClass);     
    }
  }

  return classObjArr; 
}

// Checks if all prereqs of a class have been completed
// complete = array of class ids
// prereqs = array of object arrays
function supersetChecker(complete, preReqs) 
{
  //console.log("\n\nGO TO SUPER SET CHECKER:");
  const len = preReqs.length;
  let preReqMet;
  for (let i = 0; i < len; i++)
  {
    preReqMet = false;

    // checks possible coreqs
    for (let j = 0; j < preReqs[i].class.length; j++)
    {
      if (complete.includes(preReqs[i].class[j]))
      {
        preReqMet = true;
      }
    }
    if (!preReqMet)
    {
      //console.log("Not today, satan");
      return false;
    }
  }
  //console.log("Yay!!!");
  return true; 
}

// find ALL(assume there can be more than one) instances of [classId] in [userId]'s [scheduleNum]th schedule and delete it
// THIS WORKS NOW PLZ DONT TOUCH THX :)
async function classSearchAndDestroy(userId, classId, user, res)
{
  let allSchedules = user.schedule;
 
  console.log("DESTORY >:(");
  console.log(allSchedules);

  await User.findByIdAndUpdate(userId,
    // Delete all instances of the class in a schedule
    { $pull: { "schedule.$[].semester": classId } }, 
    {new: true}, (err, result) => {
      if (err) 
      {
        res.send({ error: "Delete class error nawr" });
        res.status(400)
        return res;
      } 
      else
        res.send(result.ops[0]);
    }
  );
    
  console.log("Updated schedule:", user.schedule);
  console.log("at the end of classSearchAndDestroy");
}

// TODO: Gaby comment this pl0x
// TODO: this needs to be fixed
// Does it tho, does it realllllyyyy?
async function classAdd(userId, classId, semesterNum, user, res)
{
  console.log("Adding...");
  // Updates local user
  var help = user.schedule[semesterNum].semester.push(classId);

  console.log("Adding testy", help);
  console.log(user.schedule);

  console.log("Hello", user.schedule[semesterNum].semester[0]);

  await User.findOneAndUpdate(
    { _id: userId },
    { $push: { "schedule.$[element].semester": classId } },
    { arrayFilters: [ { "element.semester":  user.schedule[semesterNum].semester[0]} ] },
    (err, result) => {
      if (err) {
        res.send({ error: "Add class error nawr" });
        res.status(400);
        return res; 
      } else {
        res.send(result.ops[0]);
      }
    }
  );

  console.log("YAY! ADD WORKY!");
}

// Done :) (We hope)
// ***NEEDS TESTING***
// Nvm ignore this function entirely -The 52848484738th restructure
function gepOptimizer(currentClass, currSemPoss, gepCheck, stateCoreCompleted, grwsCompleted, civLitCompleted)
{
  // GEP 1 -> ENC1101
  // GEP 2 -> ENC1102
  // GEP 7 -> MAC2311 -
  // GEP 8 -> STA2023 -
  // GEP 11 -> PHY2048 -
  // GEP 12 -> BSC2010 -
  
  let betterClass;
  console.log("Bad class:", currentClass);

  // Priority checker :``)
  if (currentClass.classType == "gep")
  {
    // if the GEP is NOT already completed 
    if (!gepCheck[parseInt(currentClass.gep[0])])
    {
      // Filter for same gep & if it has gepReqs
      // Grab all classes that fit in gep # and can fulfill some gep reqs
      let betterOptions = currSemPoss.filter((el) => el.gep[0] == currentClass.gep[0] && el.gepReqs)
      console.log("If:", betterOptions);
      
      // * Optimization *
      for (let i = 0; i < betterOptions.length; i++)
      {
        if (!civLitCompleted && betterOptions[i].gepReqs.includes("CL"))
        {
          betterClass = betterOptions[i];
        }
        if (!grwsCompleted && betterOptions[i].gepReqs.includes("GRW"))
        {
          betterClass = betterOptions[i];
        }
        if (!stateCoreCompleted && betterOptions[i].gepReqs.includes("State Core"))
        {
          betterClass = betterOptions[i];
        }
      }
      console.log("Pog class", betterClass);
      return betterClass;
    }
    // GEP is already completed, check for other non completed GEPs to fulfill left over requirements (if any)
    else if (!stateCoreCompleted || !grwsCompleted || !civLitCompleted)
    {
      let betterOptions = currSemPoss.filter((el) => el.gepReqs)
      console.log("Else:", betterOptions);

      // * Optimization *
      for (let i = 0; i < betterOptions.length; i++)
      {
        if (!gepCheck[betterOptions[i].gep[0]])
        {
          if (!civLitCompleted && betterOptions[i].gepReqs.includes("CL"))
          {
            betterClass = betterOptions[i];
          }
          if (!grwsCompleted && betterOptions[i].gepReqs.includes("GRW"))
          {
            betterClass = betterOptions[i];
          }
          if (!stateCoreCompleted && betterOptions[i].gepReqs.includes("State Core"))
          {
            betterClass = betterOptions[i];
          }
        }
      }
      console.log("Pog class", betterClass);
      return betterClass;
    }
  }
  return currentClass;
}

// ------------------------------------------------------------------------------------------------------------------------------------
// endpoint prison
// ------------------------------------------------------------------------------------------------------------------------------------

// login
app.post("/api/login", async (req, res) => 
{
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) 
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "Invalid email/password",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  if (!user.verified) 
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "User not verified",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  if (await bcrypt.compare(password, user.password).catch((err) => 
    {
      res.status(400);
      const token = jwt.sign(
        {
          error: "Failed to hash password",
        },
        process.env.JWT_SECRET
      );
      return res.json({ data: token });
    })
  )
  {
    // email password is successful
    res.status(200);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }
  // password is incorrect
  else 
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "Invalid email/password",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  res.status(500);
  const token = jwt.sign(
    {
      error: "Unknown error",
    },
    process.env.JWT_SECRET
  );
  return res.json({ data: token });
});

// register
app.post("/api/register", async (req, res) => 
{
  const { email, password: plainTextPassword } = req.body;

  // if the email is empty or it is not a string
  if (!email || typeof email !== "string" || email.match(/\S+@\S+\.\S+/) == null)
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "Invalid Email, must be in email format",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  // if the password is empty or it is not a string
  if (!plainTextPassword || typeof plainTextPassword !== "string") 
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "Invalid Password",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  // if the password is not the correct length
  if (plainTextPassword.length <= 5)
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "Password too small",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);
  const verifCode = makeVerifCode();

  try 
  {
    const user = await User.create(
    {
      email,
      password,
      verified: false,
      verifCode,
      schedules: [],
      completedClasses: [],
    });
    console.log("user created successfully" + user);

    // this is for email sending stuff
    const msg = 
    {
      // to: email
      to: "Top.of.the.schedule.inc.inc@gmail.com",
      from: "Top.of.the.schedule.inc.inc@gmail.com",
      subject: "Your Top o' the Schedule Registration Key",
      text: "Here is your Verification Code: " + verifCode,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) 
        console.error(error.response.body);
        
      // delete the user
      await User.deleteOne({ _userId: user._id });
      res.status(500);
      const token = jwt.sign(
        {
          error: "Failed to create user",
        },
        process.env.JWT_SECRET
      );
      return res.json({ data: token });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );

    res.status(200);
    res.json({ data: token });
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      const token = jwt.sign(
        {
          error: "Email already in use",
        },
        process.env.JWT_SECRET
      );
      res.status(400);
      return res.json({ data: token });
    }
    throw error;
  }
  res.status(200);
});

// Verify User
app.post("/api/verifyUser", async (req, res) =>
{
  // yoink
  const { userId, verifCode } = req.body;
  const user = await User.findById(userId).lean();

  // If userId doesn't match any user - ree
  if (!user) {
    const token = jwt.sign(
      {
        error: "User does not exist",
      },
      process.env.JWT_SECRET
    );

    res.status(400);
    return res.json({ error: "User does not exist" });
  }

  // if wrong verification code
  if (user.verifCode != verifCode) {
    const token = jwt.sign(
      {
        userId: user._id,
        error: "Invalid Verification Code",
      },
      process.env.JWT_SECRET
    );

    res.status(400); // double check
    return res.json(
      {
        userId: user._id,
        error: "Invalid Verification Code"
      });
  }

  // user has already been verified
  if (user.verified) {
    const token = jwt.sign(
      {
        error: "User already verified",
      },
      process.env.JWT_SECRET
    );

    res.status(400); // double check
    return res.json({ error: "User already verified" });
  }

  // yoinks scoob, the user has not been verified
  if (!user.verified) {
    // all good raggy
    // B) swag
    // TEST THIS
    User.findByIdAndUpdate(userId, { verified: true }, (err, docs) => {
      if (err) {
        const token = jwt.sign(
          {
            error: "User could not be verified",
          },
          process.env.JWT_SECRET
        );
        // 500 since its a server error
        res.status(500); // double check
        return res.json({ error: "User could not be verified" });
      } else {
        // it did work woo yay fun time woo party woo
        const token = jwt.sign(
          {
            userId: userId,
          },
          process.env.JWT_SECRET
        );
        // 200 since it succeeded
        res.status(200);
        return res.json({ userId: userId });
      }
    });
  }
});

// get Email
app.post("/api/getEmail", async (req, res) =>
{
  const { email } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    const token = jwt.sign(
      {
        error: "User not found",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }
  
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );
  res.status(200);
  return res.json({ data: token });
});

// reset password
app.post("/api/resetPassword", async (req, res) =>
{
  // yoink
  const { userId, password: plainTextPassword } = req.body;
  const user = await User.findOne({ userId }).lean();

  // if the user was not found
  if (!user) 
  {
    const token = jwt.sign(
      {
        error: "User not found",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }

  // yoinks scoob, the user has not been verified
  if (!user.verified) 
  {
    const token = jwt.sign(
      {
        error: "User not verified",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }
  
  // change the password in the database
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  User.findByIdAndUpdate(userId, { password: hashedPassword }, (err, docs) => 
  {
    if (err) 
    {
      // Could not update user
      const token = jwt.sign(
        {
          error: "Could not update user",
        },
        process.env.JWT_SECRET
      );
      res.status(500);
      return res.json({ data: token });
    } 
    else
    {
      // updated user correctly
      const token = jwt.sign(
        {
          userId: userId,
        },
        process.env.JWT_SECRET
      );
      res.status(200);
      return res.json({ data: token });
    }
  });
});

app.post("/api/verifyForgotPassword", async(req, res) =>
{
  // yoink
  const { userId, verifCode } = req.body;
  const user = await User.findById(userId).lean();

  // If userId doesn't match any user - ree
  if (!user)
  {
    const token = jwt.sign(
      {
        error: "User does not exist",
      },
      process.env.JWT_SECRET
    );

    res.status(400);
    return res.json({ data: token });
  }

  if (user.verified === false)
  {
    const token = jwt.sign(
      {
        error: "User not verified",
      },
      process.env.JWT_SECRET
    );

    res.status(400);
    return res.json({ data: token });
  }

  // if wrong verification code
  if (user.verifCode != verifCode) {
    const token = jwt.sign(
      {
        userId: user._id,
        error: "Invalid Verification Code",
      },
      process.env.JWT_SECRET
    );

    res.status(400); // double check
    return res.json({ data: token });
  }

  const token = jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET
  );

  res.status(200);
  return res.json({ data: token });
});

// register
app.post("/api/forgotPasswordEmail", async (req, res) => 
{
  const { email } = req.body;

  // if the email is empty or it is not a string
  if (!email || typeof email !== "string" || email.match(/\S+@\S+\.\S+/) == null)
  {
    res.status(400);
    const token = jwt.sign(
      {
        error: "Invalid Email, must be in email format",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  const verifCode = makeVerifCode();

  // ---------don't make a new user but change the verifCode------------
  let user = await User.findOne({ email : email }).lean();
  let userId = user._id;

  User.findByIdAndUpdate(userId, { verifCode: verifCode }, (err, docs) =>
  {
    if (err)
    {
      const token = jwt.sign(
        {
          error: "could not update verifCode",
        },
        process.env.JWT_SECRET
      );
      // 500 since its a server error
      res.status(500); // double check
      return res.json({ data: token });
    } 
    else // no error adding verifCode
    {
      const token = jwt.sign(
        {
          userId: userId,
        },
        process.env.JWT_SECRET
      );
      res.status(200);
      return res.json({ data: token });
    }
  });

  // this is for email sending stuff
  const msg = 
  {
    // to: email,
    to: "Top.of.the.schedule.inc.inc@gmail.com",
    from: "Top.of.the.schedule.inc.inc@gmail.com",
    subject: "Your Top o' the Schedule Registration Key",
    text: "Here is your Verification Code: " + verifCode,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) 
      console.error(error.response.body);
      
    // DON'T delete the user please and thank you
    // await User.deleteOne({ _userId: user._id });
    res.status(500);
    const token = jwt.sign(
      {
        error: "Failed to send message",
      },
      process.env.JWT_SECRET
    );
    return res.json({ data: token });
  }

  const token = jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET
  );

  res.status(200);
  return res.json({ data: token });
});

// TODO: this, but after the fifteenth database restructure
// Edit Class
app.post("/api/editClass", async (req, res) => 
{
  const { userId, semesterNum, classId } = req.body;
  try 
  {
    if (semesterNum <= 0)
    {
      // 400 error, "invalid schedule or semester number", return
      const token = jwt.sign(
        {
          error: "invalid schedule or semester number",
        },
        process.env.JWT_SECRET
      );
      res.status(400);
      return res.json({ data: token });
    }
    const user = await User.findById(userId).lean();
    console.log("got user");

    // if the user does not exist
    if (!user) {
      // 400 error, "User not found", return
      const token = jwt.sign(
        {
          error: "User not found",
        },
        process.env.JWT_SECRET
      );
      res.status(400);
      return res.json({ data: token });
    }
    // SPOOKY GHOST oOoOoOoOoooooOOOO

    const classObj = await Class.findOne({ classId }).lean();
    console.log("got classObj, type of " + typeof classObj);
    console.log(classObj);

    // if class does not exist
    if (!classObj) {
      // 400 error, "No such class exists", return
      const token = jwt.sign(
        {
          error: "No such class exists",
        },
        process.env.JWT_SECRET
      );
      res.status(400);
      return res.json({ data: token });
    }

    // get prereqs of classId, store in array classPrereqs
    const classPrereqs = classObj.preReqs;

    // get postreqs of classId, store in array classPostreqs
    const classPostReqs = classObj.postReqs;

    // get class names of the classes in the semester specified, store in array semClasses
    let semClasses = user.schedule[semesterNum - 1].semester;

    // Check prereqs to classes in semester
    if (classPrereqs && (semesterNum > 1))
    {
      for (let i = 0; i < classPrereqs.length; i++)
      {
        for (let j = 0; j < semClasses.length; j++)
        {
          // if there are any matches in the arrays "classPrereqs" and "semClasses"
          if (classPrereqs[i] == semClasses[i])
          {
            // 400 error, "prerequisite not met", return
            const token = jwt.sign(
              {
                error: "Prerequisite not met",
              },
              process.env.JWT_SECRET
            );
            res.status(400);
            return res.json({ data: token });
          }
        }
      }
    }

    // Check postreqs of class against semester
    if (classPostReqs) {
      for (let i = 0; i < classPostreqs.length; i++) {
        for (let j = 0; j < semClasses.length; j++) {
          // if there are any matches in the arrays "classPrereqs" and "semClasses"
          if (classPostreqs[i] == semClasses[i]) {
            // 400 error, "postrequisite not met", return
            const token = jwt.sign(
              {
                error: "Postrequisite not met",
              },
              process.env.JWT_SECRET
            );
            res.status(400);
            return res.json({ data: token });
          }
        }
      }
    }

    // Move class from current semester to new semester --------------------------------------------
    await classSearchAndDestroy(userId, classId, user);
    await classAdd(userId, classId, semesterNum-1, user);
  
    console.log("ping pong");

    const token = jwt.sign(
      {
        error: "WOO IT DOES THE THING",
      },
      process.env.JWT_SECRET
    );
    res.status(200);
    return res.json({ data: token });

    // otherwise, success!
    // users object -> schedule -> add class to semester -> check which semester had the class -> send it
  } catch {
    // catch
    // 500 error, "database fail?"
    const token = jwt.sign(
      {
        error: "Yikes :(",
      },
      process.env.JWT_SECRET
    );
    res.status(500);
    return res.json({ data: token });
  }
});

//getElectives + with each prerecs
app.get("/api/getElectives", async (req, res) =>
{
  // find a
  const classObj = await Class.find({ classType: "elective" }).lean();

  try {
    const token = jwt.sign(
      {
        electives: classObj,
      },
      process.env.JWT_SECRET
    );
    res.status(200);
    return res.json({ data: token });
  } catch {
    const token = jwt.sign(
      {
        error: "Something Bad Happened",
      },
      process.env.JWT_SECRET
    );
    res.status(500);
    return res.json({ data: token });
  }
});

// TODO: this
app.post("/api/getSchedule", async (req, res) =>
{
  res.status(500);
  return res.json({ data: "This endpoint does not work yet :(" });
});

app.post("/api/generateSchedule", async (req, res) =>
{

  const { userId } = req.body;

  // Grab user
  let user = await User.findById(userId).lean();

  if (!user)
  {
    const token = jwt.sign(
      {
        error: "No user found",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }

  console.log("AAAAAAAAAAAAAAAA");
  newSchedule = [
    { semester: ["ENC1101", "SPC1016", "MAC2311", "COP2500"] },
    { semester: ["ENC1102", "COP3223", "BSC2010", "PHY2048"] }
  ];


  console.log(newSchedule.type);

  // newSchedule = JSON.stringify(newSchedule);

  await User.findByIdAndUpdate( userId, { schedule: newSchedule });
  console.log("Updated");
  const token = jwt.sign(
    {
      // Daniel plzzzzzzzzzzzz give schedule to this user \/\/\/\/\/ -Gaby (z emphasis by Christine)
      // 624fa445adb7d5549e6f78d7
      schedule: newSchedule
    },
    process.env.JWT_SECRET
  );
  res.status(200);
  return res.json({ data: token });
});

// The actual generate schedule \/
app.post("/api/newTest_generateSchedule", async (req, res) => 
{
  const
  {
    userId = 0,
    nextSemSeason = "",
    completedClasses: localCompletedClasses = [],
    selectedElectives: localSelectedElectives = []
  } = req.body;
  let completedClasses = localCompletedClasses;
  let selectedElectives = localSelectedElectives;
  let initialCompletedClassesLength = completedClasses.length;
  let initialSeason = nextSemSeason;
  // console.log("Selected electives: " + selectedElectives);

  // TODO: This is literally only being used once do we really need it?
  const hardCodedFirstSemFallSpring = ["GEP1", "GEP3", "MAC2311", "COP2500"];
  const hardCodedFirstSemSummer = ["GEP1", "GEP3"];

  // Input (required) Variables:
  if (userId === 0) 
  {
    const token = jwt.sign(
      {
        error: "Invalid request: no userId",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }
  if (nextSemSeason == "") 
  {
    const token = jwt.sign(
      {
        error: "Invalid request: no nextSemSeason",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }
  if (selectedElectives === 0)
  {
    const token = jwt.sign(
      {
        error: "Invalid request: no selectedElectives",
      },
      process.env.JWT_SECRET
    );
    res.status(400);
    return res.json({ data: token });
  }

  let currSemSeason = nextSemSeason;

  // Grab user 
  let user = await User.findById(userId).lean();
  // Update the users completed classes
  await User.findByIdAndUpdate(userId, { completedClasses: completedClasses });

  // Grab list of core classes and nerf
  let coreClasses = await Class.find({ classType: "core" }).lean();
  coreClasses = nerfer(coreClasses);
  coreClasses.splice(coreClasses.indexOf("MAC1114"), 1);
  coreClasses.splice(coreClasses.indexOf("MAC1105"), 1);
  completedClasses.push("MAC1114");
  completedClasses.push("MAC1105");

  // remove completed core classes
  for (let c = 0; c < coreClasses.length; c++)
  {
    if (completedClasses.includes(coreClasses[c]))
    {
      coreClasses.splice(c, 1);
    }
  }

  let gradReqFulfilled = false;
  let gepsCompleted = false;

  // GEP array
  let gepCheck = new Array(13);
  gepCheck.fill(false); 
  gepCheck[7] = true; // Calc 1
  gepCheck[8] = true; // Stats, python, intro to c, cs1, discrete
  gepCheck[11] = true; // Physics 1
  gepCheck[12] = true; // Bio 1 (soft requirement)
  const classCodePat = /[A-Z]{3}[0-9]{4}$/ig;
  
  let localSchedule = [];
  let currSemClasses = [];
  let electiveCount = 0;
  let maxMathScience = 3;
  let mathScienceCount = 0;
  let currSemPoss = [];

  // Check completed classes
  for (let i = 0; i < completedClasses.length; i++)
  {
    // grab the class
    let currentClass = await Class.findOne({ classId : completedClasses[i] }).lean();
    // if it is a type GEP
    if (currentClass.classType == "gep")
    {
      // mark that gep as done
      gepCheck[parseInt(currentClass.gep[0])] = true;
    }
    else if (currentClass.classType == "core")
    {
      let kill = coreClasses.indexOf(currentClass.classId);
      //console.log("Cores " + coreClasses);
      //console.log("Time to die " + kill);
      if (kill != -1)
      {
        coreClasses.splice(kill, 1);
      } 
    }
    else if (currentClass.classType == "elective")
    {
      electiveCount++;
    }
    else if (currentClass.classType == "math/science")
    {
      mathScienceCount++;
    }

    // Is this skipping the class entirely??? Does it need to be the very first thing?
    if (!currentClass.postReqs)
    {
      continue;
    }

    let numPostReqs = currentClass.postReqs.length;
    // TODO: mark potential requirements fulfilled

    // Go through each of the postreqs
    for (let j = 0; j < numPostReqs; j++)
    {
      // doesnt account for coreq possibilities lol
      let postRec = await Class.findOne({ classId : currentClass.postReqs[j].class[0] }).lean();

      if (!currSemPoss.includes(postRec.classId)) 
      {
        // if the user can take the class
        // if the prereqs of the current post req have been met
        // if the prereqs of the current post req are all already contained inside of completed classes
        // if the prereqs of the current post req are a subset of completed classes
        // if the completed classes are a superset of the prereqs of the current post req
        if (supersetChecker(completedClasses, postRec.preReqs)
              && !completedClasses.includes(postRec.classId))
        {
          currSemPoss.push(postRec);
        }
      }
    }
  }

  // for each class in coreClasses
    // if the class has no prereqs and it isn't in completedClasses and it isn't in currSemPoss
      // add it to currSemPoss
  for (let i = 0; i < coreClasses.length; i++)
  {
    let currentClass = await Class.findOne({ classId : coreClasses[i] }).lean();
    if (!currentClass.preReqs)
    {
      currSemPoss.push(currentClass);
    }
  }

  while (!gradReqFulfilled)
  {
    // console.log("---------------------------------------------\nNew Semester\n---------------------------------------------");
    if (initialCompletedClassesLength == 0 && localSchedule.length == 0)
    {
      if (nextSemSeason == "Fall" || nextSemSeason == "Spring")
      {
        currSemClasses = hardCodedFirstSemFallSpring;
        gepCheck[1] = true;
        gepCheck[3] = true;
        coreClasses.splice(coreClasses.indexOf("MAC2311"), 1);
        coreClasses.splice(coreClasses.indexOf("COP2500"), 1);
        // completedClasses.push("MAC2311");
        // completedClasses.push("COP2500");
      }
      else // if summer
      {
        // TODO: This
        currSemClasses = hardCodedFirstSemSummer;
        gepCheck[1] = true;
        gepCheck[3] = true;
        currSemPoss = nerfer(currSemPoss);
        currSemPoss = await unNerfer(currSemPoss);
      }
    }
    else // if the user has completed classes
    {
      //console.log("presort: " + currSemPoss);

      currSemPoss = await unNerfer(currSemPoss);
      currSemPoss.sort(classCompare);

      if (currSemSeason === "Summer")
      {
        // Give 2 geps
        let gepCount = 0;
        for (let i = 1; i < gepCheck.length && currSemClasses.length < 2; i++)
        {
          if (!gepCheck[i])
          {
            // if they're trying to add GEP2 when GEP1 is in the semester
            if (i == 2 && currSemClasses.indexOf("GEP1") != -1)
              continue;
            currSemClasses.push("GEP" + i);
            gepCheck[i] = true;
            gepCount++;
          }
        }
        while (mathScienceCount < maxMathScience && currSemClasses.length < 2)
        {
          currSemClasses.push("Math/Science Elective");
          mathScienceCount++;
        }
        for (let i = 0; i < currSemPoss.length; i++)
        {
          if (currSemClasses.length < 2)
          {
            if ((currSemPoss[i].classId == "COP4934" || currSemPoss[i].classId == "COP4935")
                && currSemClasses.indexOf(currSemPoss[i].classId) == -1
                && coreClasses.indexOf(currSemPoss[i].classId) != -1)
            {
              currSemClasses.push(currSemPoss[i].classId);
              let kill = coreClasses.indexOf(currSemPoss[i].classId);
              if (kill != -1)
              {
                coreClasses.splice(kill, 1); 
              }
            }
          }
          else
          {
            break;
          }
        }
      }
      // not Summer
      else 
      {
        // Havent take CS2 yet
        if (completedClasses.indexOf("COP3503") == -1)
        {
          // Give three core classes
          let coreCount = 0;
          let currSemClassesLengthIsValid = currSemClasses.length < 4;
          for (let i = 0; i < currSemPoss.length && (coreCount < 3 || (currSemClasses.indexOf("COT3960") != -1 && coreCount < 4)); i++)
          {
            // Add up to 3 core classes
            // Ignore classes already in the semester
            if (currSemPoss[i].classType == "core" && currSemClasses.indexOf(currSemPoss[i].classId) == -1 && coreClasses.indexOf(currSemPoss[i].classId) != -1)
            {

              // console.log("Adding " + currSemPoss[i].classId);
              // console.log("Lives at " + currSemClasses.indexOf(currSemPoss[i].classId));
              currSemClasses.push(currSemPoss[i].classId);
  
              
              let kill = coreClasses.indexOf(currSemPoss[i].classId);
              if (kill != -1)
              {
                coreClasses.splice(kill, 1); 
              }
  
              // :lookingaway: from foundation exam
              if (currSemPoss[i].classId != "COT3960")
              {
                coreCount++;
              }

              // if the foundation exam is in the semester
              if (currSemClasses.indexOf("COT3960") != -1)
              {
                currSemClassesLengthIsValid = currSemClasses.length <= 5;
                // console.log("This semester has foundation exam");
                // console.log("coreCount: " + coreCount);
                // console.log("length of semester is: " + currSemClasses.length);
                // console.log("currSemClassesLengthIsValid: " + currSemClassesLengthIsValid);
              }
              else
              {
                currSemClassesLengthIsValid = currSemClasses.length <= 4;
              }
            }
          }
              
          // Give geps to fill semester
          for (let i = 1; i < gepCheck.length && (currSemClasses.length < 4 || (currSemClasses.indexOf("COT3960") != -1 && currSemClasses.length < 5)); i++)
          {
            if (!gepCheck[i])
            {
              // if they're trying to add GEP2 when GEP1 is in the semester
              if (i == 2 && currSemClasses.indexOf("GEP1") != -1)
                continue;
              // console.log("This is the part where a GEP is pushed to currSemClasses")
              currSemClasses.push("GEP" + i);
              gepCheck[i] = true;
            }
          }
  
          if (completedClasses.indexOf("MAC2312"))
          {
            // Give math/science electives
            while (mathScienceCount < maxMathScience && (currSemClasses.length < 4 || (currSemClasses.indexOf("COT3960") != -1 && currSemClasses.length < 5)))
            {
              currSemClasses.push("Math/Science Elective");
              mathScienceCount++;
            }
          }
  
          // Give electives to fill semester
          for (let i = 0; i < currSemPoss.length && (currSemClasses.length < 4 || (currSemClasses.indexOf("COT3960") != -1 && currSemClasses.length < 5)) && electiveCount < 6; i++)
          {
            //console.log("Adding elective " + currSemPoss[i].classId + " maybe");
            // If elective can be taken
            if (currSemPoss[i].classType == "elective" && currSemClasses.indexOf(currSemPoss[i].classId) == -1)
            {
              //console.log("Yes yay we add " + currSemPoss[i].classId);
              currSemClasses.push(currSemPoss[i].classId);

              electiveCount++;
            }
          }
        }
        else
        {
          // Give electives to fill semester
          let tempEleCount = 0;
          for (let i = 0; i < currSemPoss.length && currSemClasses.length < 4 && electiveCount < 6 && tempEleCount < 2; i++)
          {
            // console.log("Adding elective " + currSemPoss[i].classId + " maybe");
            // If elective can be taken
            if (currSemPoss[i].classType == "elective" && currSemClasses.indexOf(currSemPoss[i].classId) == -1)
            {
              // console.log("Yes yay we add " + currSemPoss[i].classId);
              currSemClasses.push(currSemPoss[i].classId);

              electiveCount++;
              tempEleCount++;
            }
          }

          // Give four core classes
          let coreCount = 0;
          let currSemClassesLengthIsValid = currSemClasses.length < 4;
          for (let i = 0; i < currSemPoss.length && coreCount < 4 && currSemClassesLengthIsValid; i++)
          {
            // Ignore classes already in the semester
            if (currSemPoss[i].classType == "core" && currSemClasses.indexOf(currSemPoss[i].classId) == -1 && coreClasses.indexOf(currSemPoss[i].classId) != -1)
            {
              // console.log("Adding " + currSemPoss[i].classId);
              // console.log("Lives at " + currSemClasses.indexOf(currSemPoss[i].classId));
              currSemClasses.push(currSemPoss[i].classId);
              
              let kill = coreClasses.indexOf(currSemPoss[i].classId);
              if (kill != -1)
              {
                coreClasses.splice(kill, 1); 
              }

              // :lookingaway: from foundation exam
              if (currSemPoss[i].classId != "COT3960")
              {
                coreCount++;
              }
              // if the foundation exam is in the semester
              if (currSemClasses.indexOf("COT3960") != -1)
              {
                // console.log("This semester has foundation exam, length of semester is: " + currSemClasses.length);
                currSemClassesLengthIsValid = currSemClasses.length < 5;
              }
              else
              {
                currSemClassesLengthIsValid = currSemClasses.length < 4;
              }
            }
          }
              
          // Give geps to fill semester
          for (let i = 1; i < gepCheck.length && currSemClasses.length < 4; i++)
          {
            if (!gepCheck[i])
            {
              // console.log("This is the part where a GEP is pushed to currSemClasses")
              currSemClasses.push("GEP" + i);
              gepCheck[i] = true;
            }
          }

          if (completedClasses.indexOf("MAC2312"))
          {
            // Give math/science electives
            while (mathScienceCount < maxMathScience && currSemClasses.length < 4)
            {
              currSemClasses.push("Math/Science Elective");
              mathScienceCount++;
            }
          }

          // console.log("selectedElectives.length: " + selectedElectives.length);
          // console.log("Oh no our code: " + currSemClasses.length);
          //let nerfedCurrSemPoss = nerfer(currSemPoss);

        } // End of CS2 check
      } // End of summer check
    } // End of completed classes check
    // Add currSemClasses to the *local* schedule

    localSchedule.push({ semester: currSemClasses });
    // console.log("\n------------------------");
    // console.log("The almighty schedule:");
    if (localSchedule.length > 15)
    {
      console.log("---It broke again :(");
      res.status(500);
      return res.json({ error: "it broke again" });
    }
    // // Fancy schedule print
    // for (let i = 0; i < localSchedule.length; i++)
    // {
    //   switch (i % 3)
    //   {
    //     case 0:
    //       console.log("\t Fall: \t\t" + localSchedule[i].semester);
    //       break;
    //     case 1:
    //       console.log("\t Spring: \t" + localSchedule[i].semester);
    //       break;
    //     case 2:
    //       console.log("\t Summer: \t" + localSchedule[i].semester + "\n");
    //       break;
    //   }
    // }

    // Check if geps are completed
    gepsCompleted = true;
    for (let i = 1; i < gepCheck.length; i++)
    {
      if (!gepCheck[i])
      {
        gepsCompleted = false;
        break;
      }
    }

    // Requirements are filled
    // GEPs, Core, Electives
    // console.log("Can graduate?")
    // console.log("Geps Completed: " + gepCheck);
    // console.log("electiveCount: " + electiveCount);
    // console.log("mathScienceCount: " + mathScienceCount);
    // console.log("coreClasses: " + coreClasses);
    if (gepsCompleted && electiveCount >= 6 && mathScienceCount >= maxMathScience && coreClasses.length == 0)
    {
      console.log("Can graduate. POGPOGPOGPOGPOGPOGPOGPOGPOG");
      gradReqFulfilled = true;
      
      // Push to database
      User.findByIdAndUpdate(userId, { schedule: localSchedule }, (err, docs) =>
      {
        if (err) 
        {
          const token = jwt.sign(
            {
              error: "Schedule could not be added to user",
            },
            process.env.JWT_SECRET
          );
          // 500 since its a server error
          res.status(500); // double check
          return res.json({ data: token });
        } 
        else
        {
          // Everything worked perfectly the first time :)
          // const token = jwt.sign(
          //   {
          //     schedule: localSchedule,
          //   },
          //   process.env.JWT_SECRET
          // );
          // 200 since it succeeded
          // Fancy schedule print
          console.log("\n------------------------");
          console.log("The almighty schedule:");
          let season = initialSeason;
          for (let i = 0; i < localSchedule.length; i++)
          {
            switch (season)
            {
              case "Fall":
                console.log("\t Fall: \t\t" + localSchedule[i].semester);
                season = "Spring";
                break;
              case "Spring":
                console.log("\t Spring: \t" + localSchedule[i].semester);
                season = "Summer";
                break;
              case "Summer":
                console.log("\t Summer: \t" + localSchedule[i].semester + "\n");
                season = "Fall";
                break;
            }
          }
          res.status(200);
          return res.json({ schedule: localSchedule });
        }
      });
    }
    else
    {
      console.log("user can not graduate");
      
      completedClasses = completedClasses.concat(currSemClasses);

      currSemPoss = nerfer(currSemPoss);

      // removes the contents of currSemClasses from currSemPoss
      // el = element
      for (let i = 0; i < currSemClasses.length; i++)
      {
        let kill = currSemPoss.indexOf(currSemClasses[i]);
        if (kill != -1)
        {
          currSemPoss.splice(kill, 1); 
        }
      }

      for (let i = 0; i < currSemClasses.length; i++) 
      {
        // if the class is NOT a GEP
        // if (currSemClasses[i].length > 6)
        if (currSemClasses[i].match(classCodePat))
        {
          currClass = await Class.findOne({ classId : currSemClasses[i] }).lean();
          // Put next available classes into currSemPoss
          // TODO: Fix :`)
          if (currClass.postReqs)
          {
            // console.log("These are the postReqs of " + currClass.classId + ": " + currClass.postReqs);
            for (let j = 0; j < currClass.postReqs.length; j++) 
            {
              // console.log("the class " + currClass.classId + " and the postreq "+ j);
              currPostReq = await Class.findOne({ classId : currClass.postReqs[j].class[0] }).lean();
              //console.log("Checking this postReq " + currPostReq.classId);
              // if (!currPostReq.preReqs)
              //   console.log("This class, " + currPostReq.classId + " has no prereqs, but it is a postreq of " + currClass.classId + "...?");
              // TODO: if the postreq has all of its prereqs in completed classes
              // this is the same thing as the subsetChecker call from above
              if (supersetChecker(completedClasses, currPostReq.preReqs) &&
                  completedClasses.indexOf(currPostReq.classId) == -1 &&
                  currPostReq.classType != "math/science")
              {
                // Throw out any electives we dont want >:(
                if (selectedElectives.indexOf(currPostReq.classId) == -1 && 
                currPostReq.classType != "elective")
                {

                  //console.log("This object is an object: " + typeof currSemPoss);
                  // console.log("\t" + currPostReq.classId + " is being added yay");
                  currSemPoss.push(currPostReq);
                }
              }
            } // End of postreq length
          } // End of if postreqs
        } // End of class code check
      } // End of semester postreq check

      // Check if electives can be added
      //console.log("Sussy error???");
      //console.log("Number: " + selectedElectives.length);
      // console.log("Selected electives: " + selectedElectives);
      for (let i = 0; i < selectedElectives.length; i++)
      {
        //console.log("Sussy ping");
        //console.log("Number: " + selectedElectives.length);
        currClass = await Class.findOne({ classId : selectedElectives[i] }).lean();
        
        if (currClass.preReqs)
        {
          if (supersetChecker(completedClasses, currClass.preReqs) &&
              completedClasses.indexOf(currClass.classId) == -1 &&
              selectedElectives.indexOf(currClass.classId) != -1)
          {
            //console.log(currClass.classId + " is being added yay");
            currSemPoss.push(currClass);

            let kill = selectedElectives.indexOf(currClass.classId);
            if (kill != -1)
            {
              selectedElectives.splice(kill, 1); 
            }

            if (currClass.classType != "elective")
            {
              maxMathScience--;
            }
          }
        }
        else
        {
          // console.log(currClass.classId + " is being added yay");
          currSemPoss.push(currClass);

          let kill = selectedElectives.indexOf(currClass.classId);
          if (kill != -1)
          {
            selectedElectives.splice(kill, 1); 
          }

          if (currClass.classType != "elective")
          {
            maxMathScience--;
          }
        }
      }

      // Special case for stupid tech writing
      if (completedClasses.indexOf("GEP2") != -1 && 
          completedClasses.indexOf("ENC3241") == -1 && 
          coreClasses.indexOf("ENC3241") != -1 &&
          currSemPoss.indexOf("ENC3241") == -1)
      {
        currPostReq = await Class.findOne({ classId : "ENC3241" }).lean();
        currSemPoss.push(currPostReq);
      }

      // Special case for stupid stats
      if (completedClasses.indexOf("STA2023") == -1
          && coreClasses.indexOf("STA2023") != -1
          && currSemClasses.indexOf("STA2023") == -1
          && currSemPoss.indexOf("STA2023") == -1)
      {
        currPostReq = await Class.findOne({ classId : "STA2023" }).lean();
        currSemPoss.push(currPostReq);
      }

      // Special case for stupid biology
      if (completedClasses.indexOf("BSC2010") == -1 && 
          coreClasses.indexOf("BSC2010") != -1 && 
          currSemClasses.indexOf("BSC2010") == -1 &&
          currSemPoss.indexOf("BSC2010") == -1)
      {
        currPostReq = await Class.findOne({ classId : "BSC2010" }).lean();
        currSemPoss.push(currPostReq);
      }
      
      // Get rid of the STUPID DUPLICATING CLASSES
      currSemPoss = [...new Set(currSemPoss)];
      // console.log("currSemPoss after removing dupes: " + nerfer(currSemPoss));
      currSemPoss = await unNerfer(currSemPoss);

      // Empty the semester for the next iteration
      currSemClasses = [];
      if (currSemSeason == "Fall")
        currSemSeason = "Spring";
      else if (currSemSeason == "Spring")
        currSemSeason = "Summer";
      else if (currSemSeason == "Summer")
        currSemSeason = "Fall";
    } // end else
  }
});

// passwords
app.get("/api/passwords", (req, res) => 
{
  const count = 5;

  // Generate some passwords
  const passwords = [];
  passwords.push(":stares:");

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});

// ------------------------------------------------------------------------------------------------------------------------------------

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file. 
app.get("*", (req, res) => 
{
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);
// app.set('port', process.env.PORT || 5000);

console.log(`I'm listening on ${port}`);
