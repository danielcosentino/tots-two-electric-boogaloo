import { useState, useCallback, MouseEvent, useEffect } from 'react';
import ReactFlow, { Background, Handle, Node, useNodesState, applyEdgeChanges, applyNodeChanges, MarkerType, Position, ReactFlowProps } from 'react-flow-renderer';
import './nodeStyles.css';

import {Grid} from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Electives from "./electives.js";
import InfoPage from "./info.js";


let completed = [];
let gep_check = [true, false, false, false, false, false, false, false, false, false, false, false, false];

const handleStyle = { left: 10 };

function ClickInactiveNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);}, []);

  return (
    <div className="click-inactive">
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Intro to Discrete Testy</label>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function UnclickInactiveNode({ data }) {

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);}, []);

  return (
    <div className="click-inactive">
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Intro to Discrete Testy</label>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ClickActiveNode({ data }) {

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);}, []);

  return (
    <div className="active">
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Intro to Discrete Testy</label>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ActiveNode({ data }) {

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);}, []);

  return (
    <div className="click-active">
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Intro to Discrete Testy</label>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  clickInact: ClickInactiveNode, 
  unclickInact: UnclickInactiveNode,
  clickActive: ClickActiveNode,
  active: ActiveNode };

// here is me trying to get the color to change on click
function changeColor(id){
  // const unit = id;

  if (classes[id][4] === clickInact || classes[id][4] === unclickInact)
  {
    // do nothing
    console.log("haha clickInact or unclickInact");
  }
  else if (classes[id][4] === active)
  {
    // set clickActive
    classes[id][4] = clickActive;
    console.log("haha active");

    // add course code to list of completed
    completed.push(classes[id][1]);
    
    // update GEP list accordingly
    isGep(id);

    // decrement node_postreqs
    // activate nodes with 0 inputs
  }
  else if (classes[id][4] === clickActive)
  {
    // set active
    classes[id][4] = active;

    // increment node_postreqs
    // reactivate previous node
    // deactivate postreq nodes

    // remove index k from an index:
    // completed.splice(k, 1);
    
    // remove course code from list of completed
    completed.pop();

    // update GEP list accordingly
    isGep(id);

    console.log("haha clickActive");
  }
}

function isGep(id)
{
  // switch statement to set GEP T/F depending on original setting (allows unclick)
  switch(id) 
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
function PageTitle()
{
   return(
    <h2 id="container">Click the classes you have already completed</h2>
   );
};

// here are the styles that define the different nodes
// clickInact- clicked inactive, unclickInact-unclicked inactive, clickActive- clicked active, a- active
const clickInact = {width: 100, height: 60, backgroundColor: '#5f9c51', color: 'black', borderRadius: 10, borderWidth: 2, cursor: 'not-allowed'}
const unclickInact = {width: 100, height: 60, backgroundColor: '#EEEEEE', color: '#828282', borderRadius: 10, borderWidth: 2, cursor: 'not-allowed'}
const clickActive = {width: 100, height: 60, backgroundColor: '#8fe87b', color: 'black', borderRadius: 10, borderWidth: 2, cursor: 'pointer'}
const active = {width: 100, height: 60, backgroundColor: '#FFFFFF', color: 'black', borderRadius: 10, borderWidth: 2, cursor: 'pointer'}

// 0-id, 1-name, 2-remaining input nodes, 3-node_postreqs, 4-type, 5-course names
let classes = [
  ['1', 'COP2500', 0, [1], clickInact, 'Concepts in CS'],
  ['2', 'COP3223', 1, [], clickActive, 'Intro to C Programming'],
  ['3', 'COP3330', 1, [6], active, 'Object-Oriented Prog.'],
  ['4', 'COP3502', 1, [6,7,8], active, 'Computer Science I'],
  ['5', 'CDA3103', 1, [8], active, 'Computer Logic & Org.'],
  ['6', 'CIS3360', 1, [], active, 'Security in Computing'],
  ['7', 'COP3503', 2, [14,15], unclickInact, 'Computer Science II'],
  ['8', 'COT3960', 1, [14,15], unclickInact, 'Foundation Exam'],
  ['9', 'COP3402', 2, [16], unclickInact, 'Systems Software'],
  ['10', 'COT3100', 1, [2], unclickInact, 'Intro to Discrete'],
  ['11', 'MAC2311', 0, [11,12], active, 'Calculus I'],
  ['12', 'PHY2048', 1, [13], unclickInact, 'Physics I with Calc'],
  ['13', 'MAC2312', 1, [13], unclickInact, 'Calculus II'],
  ['14', 'PHY2049', 2, [], unclickInact, 'Physics II with Calc'],
  ['15', 'COT4210', 3, [], unclickInact, 'Discrete Structures'],
  ['16', 'COP4331', 2, [16], unclickInact, 'POOSD'],
  ['17', 'COP4934', 2, [17], unclickInact, 'Senior Design I'],
  ['18', 'COP4935', 1, [], unclickInact, 'Senior Design II'],
  ['19', 'ENC1101', 0, [19], active, 'English I (GEP 1)'],
  ['20', 'ENC1102', 1, [20], active, 'English II (GEP 2)'],
  ['21', 'ENC3241', 1, [], unclickInact, 'Technical Writing'],
  ['22', 'STA2023', 0, [], active, 'Stats I'],
  ['23', 'Extra Math 1', 0, [], active, 'Extra Math I'],
  ['24', 'Extra Math 2', 0, [], active, 'Extra Math II'],

  
  ['25', 'GEP 3', 0, [], active, 'GEP 3'],
  ['26', 'GEP 4', 0, [], active, 'GEP 4'],
  ['27', 'GEP 5', 0, [], active, 'GEP 5'],
  ['28', 'GEP 6', 0, [], active, 'GEP 6'],
  ['29', 'GEP 9', 0, [], active, 'GEP 9'],
  ['30', 'GEP 10', 0, [], active, 'GEP 10'],
  ['31', 'GEP 12', 0, [], active, 'GEP 12'],
];

// The nodes 
let initialNodes = [
  { id: classes[0][0], 
    data: { label: classes[0][5] }, 
    style: classes[0][4], 
    type: 'input', 
    position: { x: 450, y: 50 }, },
  { id: classes[1][0], 
    data: { label: classes[1][5] }, 
    style: classes[1][4],
    position: { x: 450, y: 140}, },
  { id: classes[2][0], 
    data: { label: classes[2][5] }, 
    style: classes[2][4], 
    position: { x: 270, y: 230 }, },
  { id: classes[3][0], 
    data: { label: classes[3][5] }, 
    style: classes[3][4], 
    position: { x: 390, y: 230 }, },
  { id: classes[4][0], 
    data: { label: classes[4][5] }, 
    style: classes[4][4], 
    position: { x: 510, y: 230 }, },
  { id: classes[5][0], 
    data: { label: classes[5][5] }, 
    style: classes[5][4], 
    type: 'output', 
    position: { x: 630, y: 230 }, },
  { id: classes[6][0], 
    data: { label: classes[6][5] }, 
    style: classes[6][4], 
    position: { x: 330, y: 320 }, },
  { id: classes[7][0], 
    data: { label: classes[7][5] }, 
    style: classes[7][4], 
    position: { x: 450, y: 320 }, },
  { id: classes[8][0], 
    data: { label: classes[8][5] }, 
    style: classes[8][4], 
    position: { x: 570, y: 320 }, },
  { id: classes[9][0], 
    data: { label: classes[9][5] }, 
    style: classes[9][4], 
    position: { x: 330, y: 140 }, },
  { id: classes[10][0], 
    data: { label: classes[10][5] }, 
    style: classes[10][4], 
    type: 'input', 
    position: { x: 70, y: 50 }, },
  { id: classes[11][0], 
    data: { label: classes[11][5] }, 
    style: classes[11][4], 
    position: { x: 10, y: 140 }, },
  { id: classes[12][0], 
    data: { label: classes[12][5] }, 
    style: classes[12][4], 
    position: { x: 120, y: 140 }, },
  { id: classes[13][0], 
    data: { label: classes[13][5] }, 
    style: classes[13][4], 
    type: 'output', 
    position: { x: 70, y: 230 }, },
  { id: classes[14][0], 
    data: { label: classes[14][5] }, 
    style: classes[14][4], 
    type: 'output', 
    position: { x: 270, y: 410 }, },
  { id: classes[15][0], 
    data: { label: classes[15][5] }, 
    style: classes[15][4], 
    position: { x: 390, y: 410 }, },
  { id: classes[16][0], 
    data: { label: classes[16][5] }, 
    style: classes[16][4], 
    position: { x: 450, y: 500 }, },
  { id: classes[17][0], 
    data: { label: classes[17][5] }, 
    style: classes[17][4], 
    type: 'output', 
    position: { x: 450, y: 590 }, },
  { id: classes[18][0], 
    data: { label: classes[18][5] }, 
    style: classes[18][4], 
    type: 'input', 
    position: { x: 830, y: 50 }, },
  { id: classes[19][0], 
    data: { label: classes[19][5] }, 
    style: classes[19][4], 
    position: { x: 830, y: 140 }, },
  { id: classes[20][0], 
    data: { label: classes[20][5] }, 
    style: classes[20][4], 
    type: 'output', 
    position: { x: 830, y: 230 }, },
  { id: classes[21][0], 
    data: { label: classes[21][5] }, 
    style: classes[21][4],
    type: 'input',
    position: { x: 70, y: 320 },  },
  { id: classes[22][0], 
    data: { label: classes[22][5] }, 
    style: classes[22][4], 
    type: 'input',
    position: { x: 70, y: 410 }, },
  { id: classes[23][0], 
    data: { label: classes[23][5] }, 
    style: classes[23][4], 
    type: 'input',
    position: { x: 70, y: 500 }, },
  { id: classes[24][0], 
    data: { label: classes[24][5] }, 
    style: classes[24][4], 
    type: 'input', 
    draggable: false,
    position: { x: 710, y: 410 }, 
  },
  { id: classes[25][0], 
    data: { label: classes[25][5] }, 
    style: classes[25][4], 
    type: 'input', 
    draggable: false,
    position: { x: 830, y: 410 }, 
  },
  { id: classes[26][0], 
    data: { label: classes[26][5] }, 
    style: classes[26][4], 
    type: 'input', 
    draggable: false,
    position: { x: 950, y: 410 }, 
  },
  { id: classes[27][0], 
    data: { label: classes[27][5] }, 
    style: classes[27][4], 
    type: 'input', 
    draggable: false,
    position: { x: 710, y: 490 }, 
  },
  { id: classes[28][0], 
    data: { label: classes[28][5] }, 
    style: classes[28][4], 
    type: 'input', 
    draggable: false,
    position: { x: 830, y: 490 }, 
  },
  { id: classes[29][0], 
    data: { label: classes[29][5] }, 
    style: classes[29][4], 
    type: 'input', 
    draggable: false,
    position: { x: 950, y: 490 }, 
  },
  { id: classes[30][0], 
    data: { label: classes[30][5] }, 
    style: classes[30][4], 
    type: 'input', 
    draggable: false,
    position: { x: 830, y: 570 }, },
  {
    id: 'GEP-Group',
    type: 'group',
    draggable: false,
    position: { x: 700, y: 400 },
    style: {width: 360, height: 240},
  },
  { id: 'testyCustomBoi',
    type: 'clickInact',
    position: { x: 600, y: 400 },
    data: { value: 123 },
  },
];
// the edges
const initialEdges = [
  { id: '1-2', source: '1', target: '2', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '2-3', source: '2', target: '3', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '2-4', source: '2', target: '4', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '2-5', source: '2', target: '5', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '2-6', source: '2', target: '6', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '3-7', source: '3', target: '7', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '4-7', source: '4', target: '7', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '4-8', source: '4', target: '8', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '4-9', source: '4', target: '9', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '5-9', source: '5', target: '9', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '10-7', source: '10', target: '7', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '11-10', source: '11', target: '10', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '11-12', source: '11', target: '12', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '11-13', source: '11', target: '13', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '12-14', source: '12', target: '14', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '13-14', source: '13', target: '14', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '13-15', source: '13', target: '15', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '7-15', source: '7', target: '15', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '8-15', source: '8', target: '15', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '7-16', source: '7', target: '16', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '8-16', source: '8', target: '16', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '16-17', source: '16', target: '17', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '8-17', source: '8', target: '17', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '9-17', source: '9', target: '17', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '17-18', source: '17', target: '18', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '19-20', source: '19', target: '20', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },
  { id: '20-21', source: '20', target: '21', type: 'straight', markerEnd: {type: MarkerType.ArrowClosed, color: '#808080'}, style: {stroke: '#808080'} },

];

const Flowchart = () => {
  console.log("flowchart ping");
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [nodeName, setNodeName] = useState('Node 1');

  // // set nodes the first time
  // const nodes = initialNodes; 

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'testyCustomBoi') {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }
  
        return node;
      })
    );
  }, [nodeName, setNodes]);
  
  // // set notes every other time
  // setNodes(somethingelse); 

  // Makes it movey
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  // JAVASCRIPT LOGIC TIME

  //----------- e.target.dataset.id HERES HOW TO FIND THE NODE - ID
  const handleNodeClick = (e) => {
    changeColor(e.target.dataset.id);
    console.log(e.target.dataset.id);
    let nodesCpy = nodes; 
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
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/getElectives",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      let resp = await response.json();
      setElectives(resp.electives);
      console.log("owo" + resp.electives);

    } catch (e) {
      console.log(e.toString());
      return (<h1>haha cringe</h1>);
    }
  }

  useEffect(() => {
    getElectives(); 
    // setElectives(test.electives);
    // console.log(test.electives);
    // setElectives(test.electives); 
  }, [])

  return(
      <Grid container style={{height:'100%'}}>

      <Grid item xs={10}>
      <ReactFlow 
      nodes={nodes} 
      edges={edges} 
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      //onNodeDoubleClick={onNodeDoubleClick}
      fitView
      preventScrolling
      snapToGrid
      attributionPosition='bottom-left'
      onNodeClick={handleNodeClick}
      >
          <PageTitle />
      </ReactFlow>
     
      </Grid>
      <Grid item xs={2} style={{backgroundColor: 'lightcoral', padding: 5}}>
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
      </Grid>
      
      </Grid>
  );
}

export default Flowchart;