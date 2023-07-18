"use client";
import { useAccount } from "wagmi";
import { useEffect, useState, useContext } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [contacts, setContacts] = useState([]);

  useEffect(async () => {
    try {
      const response = await fetch("/api/list", {
        method: "GET",
      });

      const data = await response.json();
      setContacts(data.contacts);
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenario
    }
  }, []);

  const update = async () => {
    try {
      const response = await fetch("/api/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contacts: contacts }),
      });

      const data = await response.json();
      console.log("deployed address", data.contract);
    } catch (error) {
      console.log("Error:", error);
      // Handle error scenarioW
    }
  };

  if (address !== "0x47039C514D7d06DA97a1B6c61931dAF710Aa50bF")
    return <div>You have no permission</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mb-4"
        onClick={update}
      >
        Update
      </button>
      <div className="relative mb-4 w-full px-4" data-te-input-wrapper-init>
        <textarea
          className="border-2 peer block min-h-[auto] w-full rounded border-1 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          id="exampleFormControlTextarea1"
          rows="22"
          placeholder="Your message"
          value={contacts.join("\n")}
          onChange={(e) => {
            setContacts(e.target.value.split("\n"));
            console.log(contacts);
          }}
        ></textarea>
      </div>
    </div>
  );
}
