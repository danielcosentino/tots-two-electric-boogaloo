/* eslint-disable no-unused-vars */
import { useState, useCallback, MouseEvent, useEffect, useRef } from 'react';
import ReactFlow, { Background, Handle, Node, useNodesState, useEdgesState, applyEdgeChanges, applyNodeChanges, MarkerType, Position, ReactFlowProps } from 'react-flow-renderer';
import './nodeStyles.css';
import { View, StyleSheet, Text } from 'react-native';
import {Grid} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Electives from "./electives.js";
import InfoPage from "./info.js";
// import GothamBold from "../fonts/Gotham-Bold.otf";
// import GothamMedium from "../fonts/GothamMedium.ttf";

console.log(".");
console.log(".");
console.log(".");
console.log("----- RESTARTING -----");
  // here are the styles that define the different nodes
  // clickInact- clicked inactive, unclickInact-unclicked inactive, clickActive- clicked active, a- active
  const darkGreen = { width: 100, height: 70, backgroundColor: '#BD9A36', color: 'black', borderRadius: 10, borderWidth: 2, cursor: 'not-allowed'}
  const grey = { width: 100, height: 70, backgroundColor: '#EEEEEE', color: '#828282', borderRadius: 10, borderWidth: 2, cursor: 'not-allowed' }
  const lightGreen = { width: 100, height: 70, backgroundColor: '#F2C417', color: 'black', borderRadius: 10, borderWidth: 2, cursor: 'pointer' }
  const white = { width: 100, height: 70, backgroundColor: '#FFFFFF', color: 'black', borderRadius: 10, borderWidth: 2, cursor: 'pointer' }

  // 0-id, 1-name, 2-remaining input nodes, 3-node_postreqs, 4-type, 5-course names
  let classes = [
    {id: "0", classId: 'COP2500', numUncompletedPrereqs: 0, preReqs: [], postReqs: [1], type: white, className: 'Concepts in CS'},
    {id: "1", classId: 'COP3223', numUncompletedPrereqs: 1, preReqs: [0], postReqs: [2, 3, 4, 5], type: grey, className: 'Intro to C Programming'},
    {id: "2", classId: 'COP3330', numUncompletedPrereqs: 1, preReqs: [1], postReqs: [6], type: grey, className: 'Object-Oriented Prog.'},
    {id: "3", classId: 'COP3502', numUncompletedPrereqs: 1, preReqs: [1], postReqs: [6,7,8], type: grey, className: 'Computer Science I'},
    {id: "4", classId: 'CDA3103', numUncompletedPrereqs: 1, preReqs: [1], postReqs: [8], type: grey, className: 'Computer Logic & Org.'},
    {id: "5", classId: 'CIS3360', numUncompletedPrereqs: 1, preReqs: [1], postReqs: [], type: grey, className: 'Security in Computing'},
    {id: "6", classId: 'COP3503', numUncompletedPrereqs: 3, preReqs: [2,3,9], postReqs: [14,15], type: grey, className: 'Computer Science II'},
    {id: "7", classId: 'COT3960', numUncompletedPrereqs: 1, preReqs: [3], postReqs: [14,15,16], type: grey, className: 'Foundation Exam'},
    {id: "8", classId: 'COP3402',numUncompletedPrereqs: 2, preReqs: [3,4], postReqs: [16],type:  grey, className: 'Systems Software'}, 
    {id: "9", classId: 'COT3100',numUncompletedPrereqs: 1, preReqs: [10], postReqs: [6],type:  grey, className: 'Intro to Discrete'}, 
    {id: "10", classId: 'MAC2311',numUncompletedPrereqs: 0, preReqs: [], postReqs: [9, 11,12],type:  white, className: 'Calculus I'}, 
    {id: "11", classId: 'PHY2048',numUncompletedPrereqs: 1, preReqs: [10], postReqs: [13],type:  grey, className: 'Physics I with Calc'}, 
    {id: "12", classId: 'MAC2312',numUncompletedPrereqs: 1, preReqs: [10], postReqs: [13, 14],type:  grey, className: 'Calculus II'}, 
    {id: "13", classId: 'PHY2049',numUncompletedPrereqs: 2, preReqs: [11,12], postReqs: [],type:  grey, className: 'Physics II with Calc'}, 
    {id: "14", classId: 'COT4210',numUncompletedPrereqs: 3, preReqs: [6,7,12], postReqs: [],type:  grey, className: 'Discrete Structures'}, 
    {id: "15", classId: 'COP4331',numUncompletedPrereqs: 2, preReqs: [6,7], postReqs: [16],type:  grey, className: 'POOSD'}, 
    {id: "16", classId: 'COP4934',numUncompletedPrereqs: 3, preReqs: [7,8,15], postReqs: [17],type:  grey, className: 'Senior Design I'}, 
    {id: "17", classId: 'COP4935',numUncompletedPrereqs: 1, preReqs: [16], postReqs: [],type:  grey, className: 'Senior Design II'}, 
    {id: "18", classId: 'ENC1101',numUncompletedPrereqs: 0, preReqs: [], postReqs: [19],type:  white, className: 'English I (GEP 1)'}, 
    {id: "19", classId: 'ENC1102',numUncompletedPrereqs: 1, preReqs: [19], postReqs: [20],type:  grey, className: 'English II (GEP 2)'}, 
    {id: "20", classId: 'ENC3241',numUncompletedPrereqs: 1, preReqs: [20], postReqs: [],type:  grey, className: 'Technical Writing'}, 
    {id: "21", classId: 'STA2023',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'Stats I'}, 
    {id: "22", classId: 'Extra Math 1',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'Extra Math I'}, 
    {id: "23", classId: 'Extra Math 2',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'Extra Math II'}, 
    {id: "24", classId: 'GEP 3',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 3'}, 
    {id: "25", classId: 'GEP 4',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 4'}, 
    {id: "26", classId: 'GEP 5',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 5'}, 
    {id: "27", classId: 'GEP 6',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 6'}, 
    {id: "28", classId: 'GEP 9',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 9'}, 
    {id: "29", classId: 'GEP 10',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 10'}, 
    {id: "30", classId: 'GEP 12',numUncompletedPrereqs: 0, preReqs: [], postReqs: [],type:  white, className: 'GEP 12'}, 
  ]

  // The nodes 
  let initialNodes = [
    { id: classes[0].id, 
      data: { label: classes[0].className }, 
      style: classes[0].type, 
      type: 'input', 
      position: { x: 450, y: 50 }, },
    { id: classes[1].id, 
      data: { label: classes[1].className }, 
      style: classes[1].type,
      position: { x: 450, y: 140}, },
    { id: classes[2].id, 
      data: { label: classes[2].className }, 
      style: classes[2].type, 
      position: { x: 270, y: 230 }, },
    { id: classes[3].id, 
      data: { label: classes[3].className }, 
      style: classes[3].type, 
      position: { x: 390, y: 230 }, },
    { id: classes[4].id, 
      data: { label: classes[4].className }, 
      style: classes[4].type, 
      position: { x: 510, y: 230 }, },
    { id: classes[5].id, 
      data: { label: classes[5].className }, 
      style: classes[5].type, 
      type: 'output', 
      position: { x: 630, y: 230 }, },
    { id: classes[6].id, 
      data: { label: classes[6].className }, 
      style: classes[6].type, 
      position: { x: 330, y: 320 }, },
    { id: classes[7].id, 
      data: { label: classes[7].className }, 
      style: classes[7].type, 
      position: { x: 450, y: 320 }, },
    { id: classes[8].id, 
      data: { label: classes[8].className }, 
      style: classes[8].type, 
      position: { x: 570, y: 320 }, },
    { id: classes[9].id, 
      data: { label: classes[9].className }, 
      style: classes[9].type, 
      position: { x: 330, y: 140 }, },
    { id: classes[10].id, 
      data: { label: classes[10].className }, 
      style: classes[10].type, 
      type: 'input', 
      position: { x: 70, y: 50 }, },
    { id: classes[11].id, 
      data: { label: classes[11].className }, 
      style: classes[11].type, 
      position: { x: 10, y: 140 }, },
    { id: classes[12].id, 
      data: { label: classes[12].className }, 
      style: classes[12].type, 
      position: { x: 120, y: 140 }, },
    { id: classes[13].id, 
      data: { label: classes[13].className }, 
      style: classes[13].type, 
      type: 'output', 
      position: { x: 70, y: 230 }, },
    { id: classes[14].id, 
      data: { label: classes[14].className }, 
      style: classes[14].type, 
      type: 'output', 
      position: { x: 270, y: 410 }, },
    { id: classes[15].id, 
      data: { label: classes[15].className }, 
      style: classes[15].type, 
      position: { x: 390, y: 410 }, },
    { id: classes[16].id, 
      data: { label: classes[16].className }, 
      style: classes[16].type, 
      position: { x: 450, y: 500 }, },
    { id: classes[17].id, 
      data: { label: classes[17].className }, 
      style: classes[17].type, 
      type: 'output', 
      position: { x: 450, y: 590 }, },
    { id: classes[18].id, 
      data: { label: classes[18].className }, 
      style: classes[18].type, 
      type: 'input', 
      position: { x: 830, y: 50 }, },
    { id: classes[19].id, 
      data: { label: classes[19].className }, 
      style: classes[19].type, 
      position: { x: 830, y: 140 }, },
    { id: classes[20].id, 
      data: { label: classes[20].className }, 
      style: classes[20].type, 
      type: 'output', 
      position: { x: 830, y: 230 }, },
    { id: classes[21].id, 
      data: { label: classes[21].className }, 
      style: classes[21].type,
      type: 'input',
      position: { x: 70, y: 320 },  },
    { id: classes[22].id, 
      data: { label: classes[22].className }, 
      style: classes[22].type, 
      type: 'input',
      position: { x: 70, y: 410 }, },
    { id: classes[23].id, 
      data: { label: classes[23].className }, 
      style: classes[23].type, 
      type: 'input',
      position: { x: 70, y: 500 }, },
    {
      id: 'GEP-Group',
      type: 'group',
      draggable: false,
      position: { x: 700, y: 360 },
      style: { width: 400, height: 330 },
      data: { label: "GEPs" },
    },
    { id: classes[24].id, 
      type: 'input', 
      data: { label: classes[24].className }, 
      position: { x: 30, y: 40 }, 
      parentNode: 'GEP-Group',
      extent: 'parent',
      style: classes[24].type,
    },
    { id: classes[25].id, 
      data: { label: classes[25].className }, 
      style: classes[25].type, 
      type: 'input', 
      parentNode: 'GEP-Group',
      extent: 'parent',
      position: { x: 150, y: 40 }, 
    },
    { id: classes[26].id, 
      data: { label: classes[26].className }, 
      style: classes[26].type, 
      type: 'input', 
      parentNode: 'GEP-Group',
      extent: 'parent',
      position: { x: 270, y: 40 }, 
    },
    { id: classes[27].id, 
      data: { label: classes[27].className }, 
      style: classes[27].type, 
      type: 'input', 
      parentNode: 'GEP-Group',
      extent: 'parent',
      position: { x: 30, y: 130 }, 
    },
    { id: classes[28].id, 
      data: { label: classes[28].className }, 
      style: classes[28].type, 
      type: 'input', 
      parentNode: 'GEP-Group',
      extent: 'parent',
      position: { x: 150, y: 130 }, 
    },
    { id: classes[29].id, 
      data: { label: classes[29].className }, 
      style: classes[29].type, 
      type: 'input', 
      parentNode: 'GEP-Group',
      extent: 'parent',
      position: { x: 270, y: 130 }, 
    },
    { id: classes[30].id, 
      data: { label: classes[30].className }, 
      style: classes[30].type, 
      type: 'input', 
      parentNode: 'GEP-Group',
      extent: 'parent',
      position: { x: 150, y: 220 },
    },
  ];

  // the edges
  const initialEdges = [
    { id: '1-2', source: '0', target: '1', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '2-3', source: '1', target: '2', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '2-4', source: '1', target: '3', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '2-5', source: '1', target: '4', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '2-6', source: '1', target: '5', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '3-7', source: '2', target: '6', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '4-7', source: '3', target: '6', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '4-8', source: '3', target: '7', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '4-9', source: '3', target: '8', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '5-9', source: '4', target: '8', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '10-7', source: '9', target: '6', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '11-10', source: '10', target: '9', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '11-12', source: '10', target: '11', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '11-13', source: '10', target: '12', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '12-14', source: '11', target: '13', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '13-14', source: '12', target: '13', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '13-15', source: '12', target: '14', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '7-15', source: '6', target: '14', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '8-15', source: '7', target: '14', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '7-16', source: '6', target: '15', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '8-16', source: '7', target: '15', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '16-17', source: '15', target: '16', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '8-17', source: '7', target: '16', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '9-17', source: '8', target: '16', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '17-18', source: '16', target: '17', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '19-20', source: '18', target: '19', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
    { id: '20-21', source: '19', target: '20', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },

  ];

const Flowchart = () =>
{
  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges); 

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [completed, setCompleted] = useState([]);
  useEffect(() => {console.log("all the completed classes", completed)}, [completed]);

  // let completed = [];
  let gep_check = [true, false, false, false, false, false, false, false, false, false, false, false, false];

  console.log(classes);

  // here is me trying to get the color to change on click
  function changeColor(id)
  {

    if (classes[id].type === darkGreen || classes[id].type === grey)
    {
      // do nothing
      console.log("haha clickInact or unclickInact");
      // return "";
    }
    // Active -> clickActive
    else if (classes[id].type === white)
    {
      // set clickActive
      // classes[id].type = clickActive;
      classes[id].type = lightGreen
      console.log("haha active");

      // add course code to list of completed
      
      setCompleted((prevCompleted) => [...prevCompleted, classes[id].classId]);
      
      // update GEP list accordingly
      isGep(id);

      console.log("haha these are the postreqs:", classes[id].postReqs);
      // Activate postreqs if all prereqs have been filled
      classes[id].postReqs.forEach(currentPostreq=>
      {
        classes[currentPostreq].numUncompletedPrereqs--;
        classes[currentPostreq].type = classes[currentPostreq].numUncompletedPrereqs <= 0 ? white : grey;
      });
      classes[id].preReqs.forEach(currentPrereq=>
        {
          classes[currentPrereq].type = darkGreen;
        });

      // return "clickActive";
    }
    // clickActive -> active (green -> white)
    else if (classes[id].type === lightGreen)
    {
      // set active
      // classes[id].type = active;
      classes[id].type = white;

      // Increment postreqs and set to unclick inactive
      console.log("checky " + classes[id].postReqs);

      // loop over postreqs
      classes[id].postReqs.forEach(currentPostreq=>
      {
        classes[currentPostreq].numUncompletedPrereqs++;
        classes[currentPostreq].type = grey;
      });

      classes[id].preReqs.forEach(currentPrereq=>
      {
        classes[currentPrereq].type = classes[currentPrereq].postReqs.some(currentPostreq=>classes[currentPostreq].type === lightGreen || classes[currentPostreq].type === darkGreen) ? darkGreen : lightGreen
      });

      // for (let i = 0; i < classes[id].postReqs.length; i++)
      // {
      //   let currentClass = classes[id].postReqs[i];
      //   classes[currentClass].numUncompletedPrereqs++;
      //   classes[currentClass].type = grey;
      //   console.log("Inactivate " + classes[currentClass].className);
      // }

      // reactivate previous node
      // for (let i = 0; i < classes[id].preReqs.length; i++)
      // {
      //   let currentClass = classes[id].preReqs[i];
      //   // classes[currentClass].type = clickActive;
      //   classes[currentClass].type = lightGreen;
      // }
      
      // remove course code from list of completed
      //completed.pop();
      // completed.splice(classes[id].classId, 1);
      console.log()
      // setCompleted((prevCompleted) => prevCompleted.splice(prevCompleted.indexOf(classes[id].classId), 1));
      setCompleted((prevCompleted) => prevCompleted.filter((x) => x !== classes[id].classId));


      // update GEP list accordingly
      isGep(id);

      console.log("haha clickActive");
      // return "active";
    }
    else
    {
      console.log("Typo dummy");
    }

    console.log(classes);

        // alert(1)

    // const unit = id;

    // classes[id].type = clickActive

    setNodes((nds) =>
    nds.map((node) => {
      console.log("node", node);
      if (node.type !== "group")
        node.style = classes[node.id].type;
      // if (node.id === id) {
      //   // it's important that you create a new object here
      //   // in order to notify react flow about the change
      // }
      return node;
    })
  );

    
  }

  function isGep(id)
  {
    // switch statement to set GEP T/F depending on original setting (allows unclick)
    switch(parseInt(id)) 
    {
      case 19:
        gepToggle(1);
        break;
      case 20:
        gepToggle(2);
        break;
      case 25:
        gepToggle(3);
        break;
      case 26:
        gepToggle(4);
        break;
      case 27:
        gepToggle(5);
        break;
      case 28: 
        gepToggle(6);
        break;
      case 11:
        gepToggle(7);
        break;
      case 22:
        gepToggle(8);
        break;
      case 29:
        gepToggle(9);
        break;
      case 30:
        gepToggle(10);
        break;
      case 12:
        gepToggle(11);
        break;
      case 31:
        gepToggle(12);
        break;
      default:
        //do nothing
    } 
  }

  function gepToggle(gep)
  {
    if (gep_check[gep] === true) gep_check[gep] = false;
    else if (gep_check[gep] === false) gep_check[gep] = true;
  }

  // here is the css to allow the graph to be visualized
  // function PageTitle()
  // {
  //    return(
  //     <h2 id="container"></h2>
  //    );
  // };




  // console.log("flowchart ping");


  // Makes it movey
  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [setNodes]
  // );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [setEdges]
  // );
  
  // JAVASCRIPT LOGIC TIME 100
  
  // Set new node type
  const [nodeType, setNodeType] = useState("active");

  const onNodeClick = (event, node) => {
    console.log("hehe clicky");
    let newType = changeColor(node.id);
    // //console.log("Changing class " + classes[node.id].type + " to type " + newType);
  
    // if (newType !== "")
    // {
    //   console.log("Change node " + classes[node.id].className + " to style/type " + newType);
    //   // for (let i = 0; i < classes.length; i++)
    //   // {
    //   //   console.log(classes[i].className + ": " + classes[i].type.backgroundColor);
    //   // }
    //   setNodeType(newType);
    // }
    // else
    // {
    //   console.log("haha loser you cant do anything");
    // }
  };

  const validateElectives = () => {
    
    if (elec1 === "" || elec2 === "" || elec3 === "" || elec4 === "" || elec5 === "" || elec6 === "")
      return (false); 
    
      return true; 

  }
  // this is what happens when we press the schedule button
  const handleScheduleSubmit = () => {

    // prepare electives to ship 
    const chosenElectives = []; 

    if (validateElectives) {
    chosenElectives.push(elec1); 
    chosenElectives.push(elec2); 
    chosenElectives.push(elec3); 
    chosenElectives.push(elec4);
    chosenElectives.push(elec5);
    chosenElectives.push(elec6);   
    }
    else {
      console.log("User didn't choose 6 electives"); 
      // maybe send back error/popup?
      return; 
    }

  }

  // Electives Stuff
  const [electives, setElectives] = useState("");
  const [elec1, setElec1] = useState("");
  const [elec2, setElec2] = useState("");
  const [elec3, setElec3] = useState("");
  const [elec4, setElec4] = useState("");
  const [elec5, setElec5] = useState("");
  const [elec6, setElec6] = useState("");

  const getElectives = async () => {
    try {
      fetch(
        process.env.REACT_APP_API_URL + "/api/getElectives",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ).then(async res=>
      {
        if (res.status !== 200)
        {
          setElectives(["database failure :("]);
        }
        else
        {
          let body = await res.json();
          setElectives(body.electives);
        }
      }).catch(err => {
      });
    } catch (e) {
      console.log(e.toString());
      return (<h1>haha cringe</h1>);
    }
  }

  useEffect(() => {
    getElectives(); 
  }, [])

  console.log('rerender')

  return(
    <div style={{
      backgroundColor:'black', 
      height:"100vh",
    }}>
      <h1 style={{
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: "40",
        color: "#FFC904",
        height: "5%"
        }}>Schedule Builder</h1>
      <Grid container style={{
        height: "90%"
        }}>
        <Grid item xs={10} style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flex: 1,
          margin: "20px",
          // width: "90%"
          }}>
          <div className="no-borderRadius">
            <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            // nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodesConnectable={false}
            //onNodeDoubleClick={onNodeDoubleClick}
            fitView
            preventScrolling
            snapToGrid
            attributionPosition='none'
            //onNodeClick={handleNodeClick}
            >
              <Background varient="dots" gap={15} size={0.8} />
              {/* <PageTitle /> */}
            </ReactFlow>
          </div>
        </Grid>
        <Grid item xs={2} style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flex: 1,
          margin: "20px",
          // width: "90%"
          }}>
          <div className="no-borderRadius">
            <Electives
            electives={electives}
            elec1={elec1}
            elec2={elec2}
            elec3={elec3}
            elec4={elec4}
            elec5={elec5}
            elec6={elec6}
            setElec1={setElec1}
            setElec2={setElec2}
            setElec3={setElec3}
            setElec4={setElec4}
            setElec5={setElec5}
            setElec6={setElec6}
            />
            <InfoPage/>
          </div>
        </Grid> {/* Electives Container*/}
      </Grid>
    </div>
  );
}
const styleSheet = StyleSheet.create({
 
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  Flowchart: {
    height: '100%',
    borderColor: '#FF3D00',
    borderWidth: 2,
    borderRadius: 9,
    justifyContent: 'center'
  }
 
});

export default Flowchart;