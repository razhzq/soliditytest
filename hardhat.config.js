require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      url: 'https://base-sepolia.g.alchemy.com/v2/pqsdHtXJi31HX4unWlkvNIXbgCmvq9I_',
      accounts: ['36b89dffafcdda124e52dd29ffe2f1d86735b8320d298d2f5ca1203126bf0e05']
    }
  }
};
