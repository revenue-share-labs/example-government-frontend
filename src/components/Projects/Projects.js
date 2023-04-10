import { React, useState } from "react";
import { Container, Row, Col, Form, Button, FormText } from "react-bootstrap";
import axios from "axios"
import ValveABI from './../../abi/Valve.json'
import ValveFactory from './../../abi/ValveFactory.json'
import TokenABI from './../../abi/Token.json'
import Deployer from './../../abi/ContractDeployer.json'
import { ethers } from "ethers"
import { CgSleep } from "react-icons/cg";
import { upload } from "@testing-library/user-event/dist/upload";
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

const deployData = {
  "timelockData": {
    "minDelay": 3600,
    "proposers": [],
    "executors": [],
  },
  "governorData": {
    "quorumPercentage": 4,
    "votingPeriod": 45818,
    "votingDelay": 1000
  }
}

const addressZero = "0x0000000000000000000000000000000000000000"
const ValveDataInit = [
  [
    3600, // minDelay
    [], // proposers
    [] // executors
 ],
  [
     3600, // minDelay
     [], // proposers
     [] // executors
  ], [
     3600, // minDelay
     [], // proposers
     [] // executors
  ]
];

  const ValveDataMint = [
    [
      addressZero, // to(нулевой, т.к. минтим на адрес только что задеплоенного TimeLock’a)
    1, // id токенов, которые будем минтить
    0,
    500000 // количество токенов, которое будет задеплоенно
], [
      addressZero, // to(нулевой, т.к. минтим на адрес только что задеплоенного TimeLock’a)
    2,
    0, // id токенов, которые будем минтить
    500000 // количество токенов, которое будет задеплоенно
], [
    "0x3604226674A32B125444189D21A51377ab0173d1", // to(адрес куда будем минтить(тут взят случайный адрес))
    0,
    1, // id токенов, которые будем минтить
    1000000 // количество токенов, которое будет задеплоенно
],[
  "0x3604226674A32B125444189D21A51377ab0173d1", // to(адрес куда будем минтить(тут взят случайный адрес))
  0,
  2, // id токенов, которые будем минтить
  1000000 // количество токенов, которое будет задеплоенно
]
];



const Projects = function () {

  // Функция для вызова Split на заданном Valve и токеном, котрый нужно сплитнуть
  async function Split() {
    console.log("Split", valveAddress, tokenAddress)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        valveAddress,
        ValveABI,
        signer
      );
      try {
        let response = await contract.Split(tokenAddress, { gasLimit: 19_000_000 });
        console.log(response);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Функция для вызова Transfer ERC20 токена с заданным amount и destinationAddress
  async function Transfer() {
    console.log("TRANSFER", tokenAddress, valveAddress, amount)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokenAddress,
        TokenABI,
        signer
      );
      console.log(signer);
      try {
        let response = await contract.transfer(valveAddress, amount);
        console.log(response);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  async function DeployValve() {
    console.log("DeployValve", valveFactory)
    if(!uploadFile) {
        alert("Upload config");
        throw ("need to upload config");
    }
    else {
        if (window.ethereum) {
            let temp = JSON.parse(await uploadFile.text());
            let deployData = temp.deployData;
            let mintData = temp.mintData;
            let deployDataArr = [];
            let mintDataArr = [];
            for (let i in deployData) {
                deployDataArr.push([deployData[i].minDelay, deployData[i].executors, deployData[i].proposers]);
            }
            for (let i in mintData) {
                mintDataArr.push([mintData[i].to, mintData[i].index, mintData[i].id, mintData[i].amount]);
            }
            console.log(deployDataArr, mintDataArr);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                valveFactory,
                ValveFactory.abi,
                signer
            );
            console.log(signer);  
            try{
                let amountValveOld = await contract.valveIndex()
                let response = await contract.deployValve(deployDataArr, mintDataArr)
                console.log(response)
                let amountValve = await contract.valveIndex()
                while(amountValve == amountValveOld){
                amountValve = await contract.valveIndex()
                }
                console.log(amountValve)
                var dict = {}
                for (var i = 0; i < amountValve; i++){
                let address  = await contract.indexToValve(i)
                dict[i] = address
                }
                setDict(dict)
                setDictSetted(true)
            } catch(error){
                console.log("Something went wrong")
                console.log(error)
            }
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
        setDictSetted(true)
      } catch(error){
        console.log("Something went wrong")
        console.log(error)
      }
  }
}

  async function DeploySystem() {
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
        let oldVote = await contract.governanceToken()
        let response = await contract.deploySystem(deployData["timelockData"]);
        console.log(response);
        let vote = await contract.governanceToken()
        // Дожидаемся исполнения предыидущей транзакции
        while (oldVote == vote) {
          vote = await contract.governanceToken()
        }
        setBook(vote)
        let gov = await contract.governorContractMulti()
        setGovernance(gov)
        let time = await contract.timeLockMulti()
        setTimelockMulti(time)
        let factory = await contract.valveFactory()
        setValveFactory(factory)
        console.log(vote, gov, time, factory)
      } catch (err) {
        console.log("error: ", err);
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
        let vote = await contract.governanceToken()
        setBook(vote)
        let gov = await contract.governorContractMulti()
        setGovernance(gov)
        let time = await contract.timeLockMulti()
        setTimelockMulti(time)
        let factory = await contract.valveFactory()
        setValveFactory(factory)
        console.log(vote, gov, time, factory)
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  const [valveAddress, setValveAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')

  const [uploadFile, setFileUpload] = useState('');
  const [dictSetted, setDictSetted] = useState(false);
  const [setupFile, setFileSetup] = useState('');

  const [dict, setDict] = useState({ "nothing": "nothing" })
  const [valveFactory, setValveFactory] = useState('not deployed ...');
  const [book, setBook] = useState("not deployed ...")
  const [governance, setGovernance] = useState("not deployed ...")
  const [timelockMulti, setTimelockMulti] = useState("not deployed ...")

  const uploadConfig = async () => {
    if (!setupFile) {
      alert('download config');
      throw ("need to download file");
    } else {
      try {
        const obj = JSON.parse(JSON.parse(JSON.stringify(await setupFile.text())));
        console.log(obj)
        console.log(obj.governance)
        console.log(obj.ids)
        if (obj.ids) {
          setDict(obj.ids)
          setDictSetted(true)
        }
        if (obj.governance) {
          setGovernance(obj.governance)
        }
        if (obj.timelockMulti) {
          setTimelockMulti(obj.timelockMulti)
        }
        if (obj.valveFactory) {
          setValveFactory(obj.valveFactory)
        }
        if (obj.votesToken) {
          setBook(obj.votesToken)
        }
      } catch (error) {
        console.log("something went wrong");
        throw (error);
      }
    };
  }

  function handleUploadFile(e) {
    console.log(e.target.files[0])
    console.log(e.target.files[0].toString('base64'));
    setFileUpload(e.target.files[0]);
  }

  function handleSetupFile(e) {
    console.log(e.target.files[0])
    console.log(e.target.files[0].toString('base64'));
    setFileSetup(e.target.files[0]);
  }

  function handleValveAddress(e1) {
    console.log(e1.target.value)
    setValveAddress(e1.target.value)
  }

  function handleTokenAddress(e1) {
    console.log(e1.target.value)
    setTokenAddress(e1.target.value)
  }

  function handleAmount(e) {
    console.log(e.target.value)
    setAmount(e.target.value)
  }

  return (
    <Container fluid className="project-section">
      {/* <Particle /> */}
      <Container>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col>
            <Form>
              <Form.Group controlId="formTransfer" className="mb-3" onChange={handleTokenAddress}>
                <Form.Label>Token Address</Form.Label>
                <Form.Control type="String" />
              </Form.Group>
              <Form.Group controlId="formTransfer" className="mb-3" onChange={handleAmount}>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="Number" />
              </Form.Group>

              <Form.Group controlId="formTransfer" className="mb-3" onChange={handleValveAddress}>
                <Form.Label>Valve Address</Form.Label>
                <SelectBasicExample data={dict} />
                <Button onClick={Split}>
                  Split
                </Button>
                <Button onClick={Transfer}>
                  Transfer
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Form>
              {/* <Form.Group controlId="formTransfer" className="mb-3">
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3" onChange={handleSetupFile}>
                <Form.Label>Upload RSC config</Form.Label>
                <Form.Control type="file" />
                <Button onClick={() => {
                  uploadConfig()
                }}>
                  Setup Rsc by config
                </Button>
              </Form.Group> */}
              {!dictSetted ?
                <Form.Group controlId="formFile" className="mb-3" onChange={handleUploadFile}>
                  <Form.Label>Upload RSC config</Form.Label>
                  <Form.Control type="file" />
                  <Button onClick={() => {
                        DeployValve()
                  }}>
                    Deploy Rsc by config
                  </Button>
                  <Button onClick={DownloadValve}>
                    Download last RSC
                  </Button>
                </Form.Group> : <p></p>
              }

              <Form.Group controlId="deployer" className="mb-3" onChange={handleValveAddress}>
                {/* <Button onClick={Split}> */}
                {!(book == "not deployed ...") ?
                  <Form.Group controlId="formTransfer" className="mb-3">
                    <Form.Label>
                      Vote Token: {book}
                    </Form.Label>
                  </Form.Group> : <p></p>}
                {!(governance == "not deployed ...") ?
                  <Form.Group controlId="formTransfer" className="mb-3">
                    <Form.Label>
                      Governor: {governance}
                    </Form.Label>
                  </Form.Group> : <p></p>}
                {!(timelockMulti == "not deployed ...") ?
                  <Form.Group controlId="formTransfer" className="mb-3">
                    <Form.Label>
                      Timelock Multi: {timelockMulti}
                    </Form.Label>
                  </Form.Group> : <p></p>}
                {!(valveFactory == "not deployed ...") ?
                  <Form.Group controlId="formTransfer" className="mb-3">
                  <Form.Label>
                      Valve Factory : {valveFactory}
                    </Form.Label>
                  </Form.Group> : <p></p>}
                {(timelockMulti == "not deployed ..." || governance == "not deployed ..." || book == "not deployed ...") ?
                  <Form.Group controlId="formTransfer" className="mb-3">
                  
                  <Button onClick={DeploySystem}>
                    Deploy system
                  </Button><Button onClick={DownloadSystem}>
                    Download system
                  </Button></Form.Group> : <p></p>}


              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Projects;
