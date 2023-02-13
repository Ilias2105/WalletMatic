require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { ALCHEMY, PRIVATE_KEY} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: ALCHEMY,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
