import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';

export default function InfoPage() {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <HelpIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Welcome to Top of the Schedule!"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is a schedule building app for Computer Science Majors at UCF.
            <br></br>
            <br></br>
            To try it out, go ahead and select the classes you've taken in the
            flowchart below. You are also going to select the 6 restricted
            elective classes you wish to take later in your career. After you
            put the next season and year of your next semester, go ahead and
            press submit to see your schedule!
            <br></br>
            <hr
              style={{
                height: 3,
                color: "black",
              }}
            ></hr>
            <strong>DISCLAIMER:</strong> This app does <strong>NOT</strong>{" "}
            account for your{" "}
            <strong>
              <abbr title="General Education Program">GEP</abbr>
            </strong>{" "}
            specific requirements. Be <strong>responsible</strong> and complete
            your <strong>State Core</strong>,{" "}
            <strong>
              <abbr title="Gordon Rule Writing">GRW</abbr>/
              <abbr title="Gordon Rule Math">GRM</abbr>
            </strong>
            , and your <strong>Civic Literacy</strong> requirements.
            <hr
              style={{
                height: 3,
                color: "black",
              }}
            ></hr>
            <em>
              <strong>
                What are the requirements I have to keep track of myself?:
              </strong>
            </em>
            <br></br>
              <a
                href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi3tIeP4Ln3AhVklmoFHcfkDa8QFnoECAQQAQ&url=https%3A%2F%2Facademicsuccess.ucf.edu%2Fssa%2Fwp-content%2Fuploads%2Fsites%2F25%2F2021%2F04%2FGEP-2021-2022-Worksheet.pdf&usg=AOvVaw3b5vC39yUAlLYJJT8WO_qM"
                target="_blank"
                rel="noopener noreferrer"
              >
                GEP sheet
              </a>&nbsp;&nbsp;
              <a
                href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiauOfRo733AhWHkmoFHaCuDQAQFnoECAMQAQ&url=https%3A%2F%2Fwww.cs.ucf.edu%2Fwp-content%2Fuploads%2F2021%2F04%2FCS-FlowChart-2021-2022.pdf&usg=AOvVaw277_ngBYU6Z4cjyOJsfE_W"
                target="_blank"
                rel="noopener noreferrer"
              >
                CS Flowchart
              </a>&nbsp;&nbsp;
              <a
                href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwj3novkrL33AhWnnGoFHXPFCxQQFnoECAUQAQ&url=https%3A%2F%2Fwww.cs.ucf.edu%2Fwp-content%2Fuploads%2F2020%2F04%2FCSIT-Elective-List-AY2020-2021.pdf&usg=AOvVaw3ionDRbq3Tt3QoDgptNBDU"
                target="_blank"
                rel="noopener noreferrer"
              >
                Electives List
              </a>
            <br></br>
            <br></br>
            <strong>
              <abbr title="General Education Program">GEP</abbr>:
            </strong>
            <br></br>&emsp;<abbr title="General Education Program">GEP</abbr>{" "}
            stands for General Education Program, and there are 12 requirements
            to complete. You need to complete one class from each of the 12
            number-marked <abbr title="General Education Program">GEP</abbr>{" "}
            sections.<br></br>
            <br></br>
            <strong>State Core:</strong>
            <br></br>&emsp;State Core requirements are the black diamonds next
            to some classes on the{" "}
            <abbr title="General Education Program">GEP</abbr> sheet. There are
            5 state core sections, headed at the top of each section with a
            black title. In order to fulfill the State Cores, you must complete
            one black diamond course for each State Core section.<br></br>
            <br></br>
            <strong>
              <abbr title="Gordon Rule Writing">GRW</abbr>/
              <abbr title="Gordon Rule Math">GRM</abbr>:
            </strong>
            <br></br>&emsp;Some classes on your schedule are titled{" "}
            <abbr title="Gordon Rule Writing">GRW</abbr> or{" "}
            <abbr title="Gordon Rule Math">GRM</abbr>. These stand for Gordon
            Rule Writing and Gordon Rule Math, respectively. To complete the{" "}
            <abbr title="Gordon Rule Writing">GRW</abbr>s, you must get at least
            a C- in four of the <abbr title="Gordon Rule Writing">GRW</abbr>{" "}
            marked classes (Ex. ENC1101) To complete the{" "}
            <abbr title="Gordon Rule Math">GRM</abbr>s, you must get at least a
            C- in two of the <abbr title="Gordon Rule Math">GRM</abbr> marked
            classes (Ex. MAC2311)<br></br>
            <br></br>
            <strong>Civic Literacy:</strong>
            <br></br>&emsp;You must complete one of the classes marked Civic
            Literacy.<br></br>
            <br></br>
            <em>
              <strong>Note to the user:</strong>
              <br></br>&emsp;Don't worry, a lot of the above requirements can be
              done at the same time for a single class. For example, STA2023(
              <abbr title="General Education Program">GEP</abbr> 8) is a great
              course, as it is a{" "}
              <abbr title="General Education Program">GEP</abbr> 8, State Core,
              and a <abbr title="Gordon Rule Math">GRM</abbr> course.
            </em>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
