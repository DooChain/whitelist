const main = async () => {
  const whiteList = await hre.ethers.deployContract("WhiteList", [
    "0x16b2724f8e59755970a64bf4603da895fe95caae0d23835859efb525b0b597a4",
  ]);
  await whiteList.waitForDeployment();
  console.log(`WhiteList deployed to ${whiteList.target}`);
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
