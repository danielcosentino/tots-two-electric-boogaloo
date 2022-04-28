
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Electives(props) {

  const MAXWIDTH = 300; 
 
  const handleChange1 = (event) => {
    props.setElec1(event.target.value);
  };
  const handleChange2 = (event) => {
    props.setElec2(event.target.value);
  };
  const handleChange3 = (event) => {
    props.setElec3(event.target.value);
  };
  const handleChange4 = (event) => {
    props.setElec4(event.target.value);
  };
  const handleChange5 = (event) => {
    props.setElec5(event.target.value);
  };
  const handleChange6 = (event) => {
    props.setElec6(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, m: 2}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Elective 1</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elec1}
          label="Elective 1"
          onChange={handleChange1}
          sx={{
            maxWidth: MAXWIDTH,
          }}
        >
           {
            props.electives ? props.electives.map((elective) => {
              if (props.elec2 === elective.classId || 
                props.elec3 === elective.classId || 
                props.elec4 === elective.classId || 
                props.elec5 === elective.classId ||
                props.elec6 === elective.classId) {
                return (<MenuItem disabled value={elective.classId}>{elective.className}</MenuItem>);
              }
              
                return (<MenuItem value={elective.classId}>{elective.className}</MenuItem>);
              
            }) : null
          }
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Elective 2</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elec2}
          label="Elective 2"
          onChange={handleChange2}
          sx={{
            maxWidth: MAXWIDTH,
          }}
        >
          {
            props.electives ? props.electives.map((elective) => {
              if (props.elec1 === elective.classId || 
                props.elec3 === elective.classId || 
                props.elec4 === elective.classId || 
               props.elec5 === elective.classId ||
               props.elec6 === elective.classId) {
                return (<MenuItem disabled value={elective.classId}>{elective.className}</MenuItem>);
              }
              
                return (<MenuItem value={elective.classId}>{elective.className}</MenuItem>);
              
            }) : null
          }
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Elective 3</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elec3}
          label="Elective 3"
          onChange={handleChange3}
          sx={{
            maxWidth: MAXWIDTH,
          }}
        >
          {
            props.electives ? props.electives.map((elective) => {
              if (props.elec1 === elective.classId || 
                props.elec2 === elective.classId || 
                props.elec4 === elective.classId || 
                props.elec5 === elective.classId ||
                props.elec6 === elective.classId) {
                return (<MenuItem disabled value={elective.classId}>{elective.className}</MenuItem>);
              }
              
                return (<MenuItem value={elective.classId}>{elective.className}</MenuItem>);
              
            }) : null
          }
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Elective 4</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elec4}
          label="Elective 4"
          onChange={handleChange4}
          sx={{
            maxWidth: MAXWIDTH,
          }}
        >
          {
            props.electives ? props.electives.map((elective) => {
              if (props.elec1 === elective.classId || 
                props.elec3 === elective.classId || 
                props.elec2 === elective.classId || 
                props.elec5 === elective.classId ||
                props.elec6 === elective.classId) {
                return (<MenuItem disabled value={elective.classId}>{elective.className}</MenuItem>);
              }
              
                return (<MenuItem value={elective.classId}>{elective.className}</MenuItem>);
              
            }) : null
          }
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Elective 5</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elec5}
          label="Elective 5"
          onChange={handleChange5}
          sx={{
            maxWidth: MAXWIDTH,
          }}
        >
          {
            props.electives ? props.electives.map((elective) => {
              if (props.elec1 === elective.classId || 
                props.elec3 === elective.classId || 
                props.elec4 === elective.classId || 
                props.elec2 === elective.classId ||
                props.elec6 === elective.classId) {
                return (<MenuItem disabled value={elective.classId}>{elective.className}</MenuItem>);
              }
              
                return (<MenuItem value={elective.classId}>{elective.className}</MenuItem>);
              
            }) : null
          }
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Elective 6</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elec6}
          label="Elective 6"
          onChange={handleChange6}
          sx={{
            maxWidth: MAXWIDTH,
          }}
        >
          {
            props.electives ? props.electives.map((elective) => {
              if (props.elec1 === elective.classId || 
                props.elec3 === elective.classId || 
                props.elec4 === elective.classId || 
                props.elec5 === elective.classId ||
                props.elec6 === elective.classId) {
                return (<MenuItem disabled value={elective.classId}>{elective.className}</MenuItem>);
              }
              
                return (<MenuItem value={elective.classId}>{elective.className}</MenuItem>);
              
            }) : null
          }
        </Select>
      </FormControl>
    </Box>
  );
}