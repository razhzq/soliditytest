

To run the contract test:
npx hardhat test


To deploy:
1. Edit the hardhat.config.js

module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      url: '',  // fill in the url with you base sepolia RPC url
      accounts: ['']  // fill in the array with your account private key
    }
  }
};