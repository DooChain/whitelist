"use client";
import { Web3Button } from "@web3modal/react";
import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  useEffect(() => {
    console.log(address, isConnected);
  }, []);
  return <Web3Button />;
}
