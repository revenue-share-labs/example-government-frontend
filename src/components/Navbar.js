import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/logo.png";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { CgGitFork } from "react-icons/cg";
import { ImBlog } from "react-icons/im";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";

// import { CgFileDocument } from "react-icons/cg";

function NavBar ({accounts, setAccounts}) {

  // const [connectContent, updateConnectContent] = useState("Connect")
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);

  const isConnected = Boolean(accounts[0]);
  const binanceTestChainId = ['0x61', 97]
  const  connectContent = isConnected?
    `Connected\t${accounts[0].slice(0,6)}...${accounts[0].slice(-5,-1)}`
    :
    "Connect"

  async function updateData(){
      if(window.ethereum) {
          const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
          });
      setAccounts(accounts);
      }
      const chainId = window.ethereum.networkVersion;
      console.log(chainId);
      if(chainId === binanceTestChainId[1]){
          console.log("Bravo!, you are on the correct network");
      } else {
          await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Polygon Mumbai',
                  chainId: binanceTestChainId[0],
                  nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                  rpcUrls: ['https://rpc-mumbai.matic.today']
                }
              ]
            });  
      console.log("oulalal, switch to the correct network")
      }
      // if isConnectd
  }

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex">
          <img src={logo} className="img-fluid logo" alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/project"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineFundProjectionScreen
                  style={{ marginBottom: "2px" }}
                />{" "}
                Demo
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/governance"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineFundProjectionScreen
                  style={{ marginBottom: "2px" }}
                />{" "}
                Governance
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                // as={Link}
                // to="/about"
                // onClick={() => updateExpanded(false)}
                href="https://x.la"
                target="_blank"
                rel="noreferrer">
                <AiOutlineUser style={{ marginBottom: "2px" }} /> About XLA
              </Nav.Link>
            </Nav.Item>


            <Nav.Item>
            <Nav.Link
                href="https://formalcrypto.org"
                target="_blank"
                rel="noreferrer"
              >
                <AiFillStar
                  style={{ marginBottom: "2px" }}
                />{" "}
                FC Partner 
              </Nav.Link>
            </Nav.Item>
{/* 
            <Nav.Item>
            <Nav.Link
                href="https://whattofarm.io"
                target="_blank"
                rel="noreferrer"
              >
                <AiFillStar
                  style={{ marginBottom: "2px" }}
                />{" "}
                WTF Partner 
              </Nav.Link>
            </Nav.Item> */}

            <Nav.Item>
              <Nav.Link
                href="https://gleb-zverev.gitbook.io/nft-farm-1/"
                target="_blank"
                rel="noreferrer"
              >
                <ImBlog style={{ marginBottom: "2px" }} /> Docs
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="fork-btn">
              <Button
                // href="https://github.com/formal-crypto/ERC1155-RSC/"
                // target="_blank"
                // className="fork-btn-inner"
                onClick = {updateData}
              >

                <CgGitFork style={{ fontSize: "1.2em" }} /> {connectContent}
                
                {/* <AiFillStar style={{ fontSize: "1.1em" }} /> */}
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
