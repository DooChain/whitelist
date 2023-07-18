const { exec } = require("child_process");

const deployScript = "scripts/deploy.js";
const network = "sepolia";

exec(
  `npx hardhat run ${deployScript} --network ${network}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing deploy script: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Deploy script error: ${stderr}`);
      return;
    }

    console.log(`Deploy script output: ${stdout}`);
  }
);
