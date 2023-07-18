import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(request) {
  const data = fs.readFileSync("../data.json", "utf8");
  // Parse the JSON data
  const jsonData = await JSON.parse(data);

  return NextResponse.json(jsonData.contract);
}
