import { NextResponse } from "next/server";
import keccak256 from "keccak256";
import { tree } from "../MerkleTree";
import fs from "fs";

//  Utility Function to Convert From Buffer to Hex
const buf2Hex = (x) => "0x" + x.toString("hex");

export async function GET(request) {
  const data = await fs.readFileSync("../data.json", "utf8");
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

    let json_response = {
      status: "success",
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
