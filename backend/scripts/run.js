const fs = require("fs");

let whiteListData = [];
// Read the contents of the JSON file
fs.readFile("whiteList.json", "utf8", (err, data) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Access the whiteList array
    whiteListData = jsonData.whiteList;
  } catch (error) {
    console.log("Error parsing JSON:", error);
  }
});
const main = async () => {
  const [owner, _] = await hre.ethers.getSigners();
  console.log(owner.address);

  const whiteListContract = await hre.ethers.deployContract("WhiteList", [
    "0x9f8f5a2556959716e288f3c87b99bdd6f65d5e325e75592494d867b245db523a",
  ]);
  await whiteListContract.waitForDeployment();
  console.log(`WhiteList deployed to ${whiteListContract.target}`);

  const result = await whiteListContract.checkIfValid(whiteListData[3].proof);
  console.log(result);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
