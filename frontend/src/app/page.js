"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import {} from "ethers";
import abi from "../../../backend/artifacts/contracts/WhiteList.sol/WhiteList.json";

export default function Home() {
  const [address, setAddress] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x065160F042F21c854eFAaA5d92E66D67E75AF125";
  const contractABI = abi.abi;

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

  const askContractIfValid = async (proof) => {
    console.log(proof);

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

        console.log("Going to pop wallet now to pay gas...");
        let checkTxn = await whiteListContract.checkIfValid(proof);
        console.log("Checking...please wait.");
        console.log(checkTxn);

        console.log(
          `Mined, see transaction: https://sepolia.etherscan.io/tx/${checkTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
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
      console.log(data);
      askContractIfValid(data.proof);
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenario
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
        <div className="flex items-center space-x-4 w-1/2">
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
      )}
    </div>
  );
}
