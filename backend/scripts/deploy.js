// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const whiteListContract = await hre.ethers.deployContract("WhiteList", [
    "0x9f8f5a2556959716e288f3c87b99bdd6f65d5e325e75592494d867b245db523a",
  ]);
  await whiteListContract.waitForDeployment();
  console.log(`${whiteListContract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
