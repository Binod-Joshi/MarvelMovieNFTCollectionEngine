import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  contractABI,
  contractAddress,
} from "../contractDetails/ContractDetails";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState(0);
  const [baseUrlOfNFT, setBaseUrlOfNFT] = useState("");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.BrowserProvider(provider); // ethers.BrowserProvider(ethereum)

    //If user not connected sepolia network,let them know throw an error
    const { chainId } = await web3Provider.getNetwork();
    console.log(chainId);
    console.log(parseInt(chainId));
    if (parseInt(chainId) !== 11155111) {
      window.alert("Change the network to the Sepolia");
      throw new Error("Change network to Sepolia");
    }

    if (needSigner) {
      const signer = await web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const publicMint = async () => {
    try {
      console.log("public mint");
      const signer = await getProviderOrSigner(true);
      const nftContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const nftMintTx = await nftContract.mint({
        value: ethers.parseEther("0.01"),
      });
      setLoading(true);
      await nftMintTx.wait();
      window.alert("You successfully minted a marvel movie NFT.");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      console.log("connect wallet function");
      await getProviderOrSigner();
      setWalletConnected(true);
      console.log("walletConnected");
    } catch (error) {
      console.log(error);
    }
  };

  const getBaseTokenUrl = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      console.log(contract);
      const baseUrlOfNFT = await contract.baseTokenURI();
      const Url = baseUrlOfNFT.split("//");
      console.log(Url[1]);
      setBaseUrlOfNFT(Url[1]);
      return Url[1];
    } catch (error) {
      console.log(error);
    }
  };

  // get the num fo tokenID that have been minted.
  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const noOfTokenIdsMinted = await contract.tokenMinted();
      console.log(noOfTokenIdsMinted);
      setTokenIdsMinted(noOfTokenIdsMinted.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const viewAllMintedNFT = async() => {
    try {
        try {
          let data;
          if (!baseUrlOfNFT) {
          data = await getBaseTokenUrl();
          console.log(data);
          }
          if (data || baseUrlOfNFT) {
            let targetValue = baseUrlOfNFT || data;
            navigate(`/viewMintedNFT/${targetValue}/${tokenIdsMinted}`)
          }
        } catch (error) {
          console.log(error);
        }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        networks: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();

      getTokenIdsMinted();

      // getBaseTokenUrl();

      setInterval(async function () {
        await getTokenIdsMinted();
      }, 50 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet

    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className="button">
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className="button">Loading...</button>;
    }

    return (
      <button className="button" onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  return (
    <div>
      <div className="main">
        <div>
          <h1 className="title">
            Welcome to the Marvel Avengers Movie NFT Collection Engine.
          </h1>
          <div className="description">
            It&#39;s an NFT collection for LearnWeb3 students.
          </div>
          <div className="description">
            {tokenIdsMinted}/15 have been minted.
          </div>
          <div>
            <button
              onClick={viewAllMintedNFT}
              className="button"
            >
              {" "}
              View All Minted NFT.
            </button>
          </div>
          {renderButton()}
        </div>
      </div>
      <footer className="footer">Made with &#10084; by Binod Joshi</footer>
    </div>
  );
};

export default Home;
