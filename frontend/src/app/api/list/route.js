import { NextResponse } from "next/server";
import keccak256 from "keccak256";
const { default: MerkleTree } = require("merkletreejs");
import fs from "fs";

//  Utility Function to Convert From Buffer to Hex
const buf2Hex = (x) => "0x" + x.toString("hex");

export async function GET(request) {
  const data = fs.readFileSync("../data.json", "utf8");
  // Parse the JSON data
  const jsonData = await JSON.parse(data);

  // Access the whiteList array
  const json_response = {
    status: "success",
    contacts: jsonData.contacts,
  };
  return NextResponse.json(json_response);
}

export async function POST(request) {
  try {
    const json = await request.json();
    console.log(json.contacts);

    //  Hashing All Leaf Individual
    const leaves = await json.contacts.map((leaf) => keccak256(leaf));

    // Constructing Merkle Tree
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });

    // Get Root of Merkle Tree
    console.log(`Here is Root Hash: ${buf2Hex(tree.getRoot())}`);

    const newData = {
      roothash: buf2Hex(tree.getRoot()),
      contacts: json.contacts,
    };
    const result = fs.writeFileSync("../data.json", JSON.stringify(newData));

    try {
      const response = await fetch("http://localhost:5000/api", {
        method: "GET",
      });
      const text = await response.text();
      console.log("response", text);
      let json_response = {
        status: "success",
        contract: text,
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log("Error:", error);
    }
  } catch (error) {
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
