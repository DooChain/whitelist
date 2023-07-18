"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import {} from "ethers";
import abi from "../../../backend/artifacts/contracts/WhiteList.sol/WhiteList.json";
import { useAccount } from "wagmi";

const contractAddress = "0xb7b3f0B17961257CD342C491bbe6192ACf6B012b";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [myProof, setMyProof] = useState([]);
  const [inputAddress, setInputAddress] = useState("");
  const [contract, setContract] = useState(null);

  const update = async () => {
    // fetch own proof from the backend
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address }),
      });

      const data = await response.json();
      console.log("your address is ", address);
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
          abi.abi,
          signer
        );
        console.log("whiteListContract:", whiteListContract);
        setContract(whiteListContract);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    console.log("Connected", address);
    update();
  }, [address]);

  const askContractIfValid = async (proof) => {
    try {
      console.log(proof, inputAddress);
      let checkTxn = await contract.checkIfValid(proof, inputAddress);
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
        body: JSON.stringify({ address: inputAddress }),
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isConnected ? (
        <>
          <div className="flex items-center space-x-4 w-1/2 my-3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
              placeholder="Type your address"
              value={inputAddress}
              onChange={(event) => {
                setInputAddress(event.target.value);
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
      ) : (
        <div className="px-60 py-2 bg-blue-500 text-white">
          Please connect your wallet
        </div>
      )}
    </div>
  );
}
