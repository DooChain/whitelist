"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import {} from "ethers";
import abi from "../../../backend/artifacts/contracts/WhiteList.sol/WhiteList.json";

export default function Home() {
  const [address, setAddress] = useState("");
  const [myProof, setMyProof] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x6b41894c1cBAAbA37b0C5c8FEd11bf65646C847B";
  const contractABI = abi.abi;
  const [contract, setContract] = useState(null);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // // String, hex code of the chainId of the Goerli test network
    // const goerliChainId = "0x5";
    // if (chainId !== goerliChainId) {
    //   alert("You are not connected to the Goerli Test Network!");
    // }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const update = async () => {
      // fetch own proof from the backend
      try {
        const response = await fetch("/api/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: currentAccount }),
        });

        const data = await response.json();
        console.log("your address is ", currentAccount);
        console.log("your proof", data);
        setMyProof(data.proof);
      } catch (error) {
        console.log("Error:", error);
        // Handle error scenario
      }

      // build the contract that can be used in multiple functions
      try {
        const { ethereum } = window;
        if (ethereum) {
          const web3Provider = new ethers.BrowserProvider(ethereum);
          const signer = await web3Provider.getSigner();
          // const provider = new ethers.providers.Web3Provider(ethereum);
          // const signer = provider.getSigner();
          const whiteListContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          console.log("wavePortalContract:", whiteListContract);
          setContract(whiteListContract);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentAccount !== "") update();
  }, [currentAccount]);

  const askContractIfValid = async (proof) => {
    try {
      let checkTxn = await contract.checkIfValid(proof, address);
      console.log("Checking...please wait.");
      console.log("The address you entered is", checkTxn ? "" : "not", "valid");
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfValid = async () => {
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address }),
      });

      const data = await response.json();
      console.log("Proof of entered address", data);
      askContractIfValid(data.proof);
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenario
    }
  };

  const buy = async () => {
    try {
      console.log("Buying...please wait.");
      let buyTxn = await contract.buy(myProof);
      console.log("Buy function called successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const switchAccount = async () => {
    try {
      // Request to switch accounts using the ethereum.request method
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Call any necessary functions or update the UI with the new account
      console.log("ReConnected", accounts);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error switching accounts:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {currentAccount === "" ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Connect to Wallet
        </button>
      ) : (
        <>
          <div className="flex items-center space-x-4 w-1/2 my-3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
              placeholder="Type your address"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={checkIfValid}
            >
              Check
            </button>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:bg-purple-600 mb-3"
            onClick={buy}
          >
            Buy
          </button>

          {/* <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
            onClick={switchAccount}
          >
            Switch Account
          </button> */}
        </>
      )}
    </div>
  );
}
