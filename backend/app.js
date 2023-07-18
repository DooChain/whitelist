const { exec } = require("child_process");

const deployScript = "scripts/deploy.js";
const network = "sepolia";

const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  exec(
    `npx hardhat run ${deployScript} --network ${network}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing deploy script: ${error.message}`);
        res.status(500).send(error.message);
        return;
      }

      if (stderr) {
        console.error(`Deploy script error: ${stderr}`);
        res.status(500).send(stderr);
        return;
      }

      console.log(`Deploy script output: ${stdout}`);
      res.status(200).send(stdout);
    }
  );
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
