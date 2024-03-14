require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      url: 'https://base-sepolia.g.alchemy.com/v2/pqsdHtXJi31HX4unWlkvNIXbgCmvq9I_',
      accounts: ''
    }
  }
};
