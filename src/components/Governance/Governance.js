import { React, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, FormText } from "react-bootstrap";
import axios from "axios"
import IGovernorMultiABI from './../../abi/IGovernorMulti.json'
import Deployer from './../../abi/ContractDeployer.json'
import { ethers } from "ethers"
import ValveFactory from './../../abi/ValveFactory.json'

// const deployerAddress = "0x011eB0a573427ce201355c6A3e82f7754dc4fd19"
const deployerAddress = "0x5672e4Be53b185F4B52A264c01da9971B8ad48C1";

function SelectBasicExample(props) {
  return (
    <Form.Select aria-label="Default select example">
      {Object.keys(props.data).map(key => (
        <option value={`${props.data[key]}`}>
          {`${key}: ${props.data[key]}`}
        </option>
      ))}
    </Form.Select>
  );
}

function Governance() {
  // //////////////////////////////////////////////
  const [valveId, setValveId] = useState('')
  const [voteWay, setVoteWay] = useState('')
  const [functionCall, setFunctionCall] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [dict, setDict] = useState({ "nothing": "nothing" })
  const [governance, setGovernance] = useState("not deployed ...")
  const [valveFactory, setValveFactory] = useState('not deployed ...');


  const [state, setState] = useState("Proposal NotExist")

  const stateDict = {
    "0": "Pending",
    "1": 'Active',
    "2": "Canceled",
    "3": "Defeated",
    "4": "Succeeded",
    "5": "Queued",
    "6": "Expired",
    "7": "Executed"
  }

  // useEffect(() => {
  //   const interval = setInterval(() => updateState(functionCall), 6000);
  //   return () => clearInterval(interval);
  // }, []);

  const updateState = async () => {
    if (window.ethereum ) {
      console.log("Hello updateState")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let blockNumber = await provider.getBlockNumber()
      console.log("BLOCKNUMBER", blockNumber)
      const contract = new ethers.Contract(
        governance,
        IGovernorMultiABI.abi,
        signer
      );
      try {
        console.log(valveId)
        const proposalId = await contract.hashProposal(valveId, [address], [0], [functionCall], ethers.utils.id(description))
        console.log("PROPOSAL_ID", proposalId)
        console.log("functionCall", functionCall)
        let deadline= await contract.proposalDeadline(valveId, proposalId)
        console.log("DEADLINE", deadline.toString())
        let response = await contract.state(valveId, proposalId);
        console.log("Response", response);        
        setState(stateDict[response])
      } catch (err) {
        console.log("error: updateState", err);
      }
    }
  }

  async function DownloadValve() {
    console.log("Download Valve", valveFactory)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        valveFactory,
        ValveFactory.abi,
        signer
      );
      console.log(signer);  
      try{
        let amountValve = await contract.valveIndex()
        console.log(amountValve)
        var dict = {}
        for (var i = 0; i < amountValve; i++){
          let address  = await contract.indexToValve(i)
          dict[i] = address
        }
        setDict(dict)
      } catch(error){
        console.log("Something went wrong")
        console.log(error)
      }
  }
}
  async function DownloadSystem() {
    console.log("deploySysyem")
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        deployerAddress,
        Deployer.abi,
        signer
      );
      console.log(signer);
      try {
        let gov = await contract.governorContractMulti()
        setGovernance(gov)
        let factory = await contract.valveFactory()
        setValveFactory(factory)
        console.log(gov)
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  async function Propose() {
    console.log("Propose", description, governance, functionCall)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        governance,
        IGovernorMultiABI.abi,
        signer
      );
      console.log(signer);
      try {
        console.log(valveId, [address], [0], [functionCall], description)
        let response = await contract["propose(uint256,address[],uint256[],bytes[],string,uint256,uint256)"](valveId, [address], [0], [functionCall], description, 45818, 1);
        console.log(response);
      } catch (err) {
        console.log("error: Propose", err);
      }
    }
  }

  async function Vote() {
    console.log("Propose", description, governance, functionCall)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        governance,
        IGovernorMultiABI.abi,
        signer
      );
      console.log(signer);
      try {
        console.log(valveId, [address], [0], [functionCall], description)
        const proposalId = await contract.hashProposal(valveId, [address], [0], [functionCall], ethers.utils.id(description))
        let response = await contract.castVoteWithReason(valveId, proposalId, voteWay, "demo interface Vote");
        console.log(response);
      } catch (err) {
        console.log("error: Vote", err);
      }
    }
  }

  async function Execute() {
    console.log("Execute", description, governance, functionCall)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        governance,
        IGovernorMultiABI.abi,
        signer
      );
      console.log(signer);
      try {
        console.log(valveId, [address], [0], [functionCall], description)
        let response = await contract.execute(valveId, [address], [0], [functionCall], ethers.utils.id(description));
        console.log(response);
      } catch (err) {
        console.log("error: Execute", err);
      }
    }
    // ["propose(uint256,address[],uint256[],bytes[],string,uint256,uint256)"]
  }

  function handleFileSelected(e) {
    console.log(e.target.files[0])
    console.log(e.target.files[0].toString('base64'));
    setFile(e.target.files[0]);
  }

  function handleValveId(e1) {
    console.log(e1.target.value)
    setValveId(e1.target.value)
  }

  function handleVoteWay(e1) {
    console.log(e1.target.value)
    setVoteWay(e1.target.value)
  }


  function handleDescription(e1) {
    console.log(e1.target.value)
    setDescription(e1.target.value)
  }

  function handleAddress(e1) {
    console.log(e1.target.value)
    setAddress(e1.target.value)
  }


  function handleFunctionCall(e1) {
    console.log("functionCall", e1.target.value)
    setFunctionCall(e1.target.value)
  }

  const submitConfig = async () => {
    if (!file) {
      alert('download config');
      throw ("need to download file");
    } else {
      try {
        console.log(file.text())
        var obj = JSON.parse(await file.text());
        console.log(obj.governance)
        console.log(obj.ids)
        setDict(obj.ids)
        setGovernance(obj.governance)
      } catch (error) {
        console.log("something went wrong");
        throw (error);
      }
    };
  }

  const [file, setFile] = useState('');
  return (
    <Container fluid className="project-section">
      {/* <Particle /> */}
      <Container>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>

          <Form>
            <Form.Group controlId="formFile" className="mb-3" onChange={handleFileSelected}>
              <Form.Label>Upload RSC config</Form.Label>
              <Form.Control type="file" />
              <Button onClick={() => {
                submitConfig()
              }}>
                Setup Rsc by config
              </Button>
            </Form.Group>

            <Form.Group controlId="formGovernance" className="mb-3">
              <Form.Label>Governance address: {governance}</Form.Label>
            </Form.Group>

            <Form.Group controlId="formGovernance" className="mb-3">
              <Form.Label>Current State: {state}</Form.Label>
              </Form.Group>
            <Form.Group controlId="formGovernance" className="mb-3">
            <Button onClick={updateState}>
                Update Current State
              </Button>
              </Form.Group>

            <Form.Group controlId="formGovernance" className="mb-3" onChange={handleDescription}>
              <Form.Label>PROPOSAL_DESCRIPTION</Form.Label>
              <Form.Control type="String" />
            </Form.Group>
            <Form.Group controlId="formGovernance" className="mb-3" onChange={handleAddress}>
              <Form.Label>Calling contract</Form.Label>
              <Form.Control type="String" />
            </Form.Group>

            <Form.Group controlId="formGovernance" className="mb-3" onChange={handleFunctionCall}>
              <Form.Label>Function Call</Form.Label>
              <Form.Control type="string" />
            </Form.Group>
            <Form.Group controlId="formGovernance" className="mb-3" onChange={handleVoteWay}>
              <Form.Label>Vote Way</Form.Label>
              <SelectBasicExample data={{ "Against": 0, "For": 1, "Abstain": 2 }} />
            </Form.Group>
            <Form.Group controlId="formGovernance" className="mb-3" onChange={handleValveId}>
              <Form.Label>Valve Address</Form.Label>
              <SelectBasicExample data={dict} />
              <Button onClick={Propose}>
                Propose
              </Button>
              <Button onClick={Vote}>
                CastVote
              </Button>
              <Button onClick={Execute}>
                Execute
              </Button>

            <Form.Group controlId="formGovernance" className="mb-3" onChange={handleValveId}>

            <Button onClick={DownloadSystem}>
                    Download Governance
              </Button></Form.Group> 
              <Button onClick={DownloadValve}>
                    Download System
              </Button></Form.Group> 

          </Form>
        </Row>
      </Container>
    </Container>
  );
}

export default Governance;
