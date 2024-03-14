const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Vault contract", function () {
  async function deployVaultFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    //Deploy a mock ERC20 contract
    const mockUSD = await ethers.deployContract("MockUSD");
    await mockUSD.waitForDeployment();

    //Deploy Vault contract
    const mockAddress = await mockUSD.getAddress();
    const vault = await ethers.deployContract("Vault", [mockAddress]);
    await vault.waitForDeployment();

    return { mockUSD, vault, user1, user2, owner };
  }

  describe("Deployment", function () {
    it("should set the vaultStable to the provided ERC20 address", async function () {
      const { mockUSD, vault } = await deployVaultFixture();

      const vaultStableAddress = await vault.vaultStable();
      const mockUSDAddress = await mockUSD.getAddress();
      expect(vaultStableAddress).to.equal(mockUSDAddress);
    });
    it("should mint 1M mock usd to deployer", async function () {
      const { mockUSD, owner } = await deployVaultFixture();
      const ownerBalance = await mockUSD.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseUnits("1000000", 18));
    });
  });

  describe("Vault function", function () {
    it("user should be able to deposit", async function () {
      const { mockUSD, vault, owner, user1, user2 } =
        await deployVaultFixture();

      const vaultAddress = await vault.getAddress();

      //transfer usd to user1 from owner
      await mockUSD
        .connect(owner)
        .transfer(user1.address, ethers.parseUnits("10000", 18));
      const user1Balance = await mockUSD.balanceOf(user1.address);
      expect(user1Balance).to.equal(ethers.parseUnits("10000", 18));

      // deposit to vault from user1
      await mockUSD
        .connect(user1)
        .approve(vaultAddress, ethers.parseUnits("10000", 18));
      await vault.connect(user1).deposit(ethers.parseUnits("10000", 18));

      // check USD balance of vault after user1 deposit
      const vaultBalanceAfterUser1 = await mockUSD.balanceOf(vaultAddress);
      expect(vaultBalanceAfterUser1).to.equal(ethers.parseUnits("10000", 18));

      // check vault balance of user1 after deposit
      const user1VaultBalance = await vault.connect(user1).getBalance();
      expect(user1VaultBalance).to.equal(ethers.parseUnits("10000", 18));
    });
    it("User should be able to withdraw", async function () {
      const { mockUSD, vault, owner, user1, user2 } =
        await deployVaultFixture();

      const vaultAddress = await vault.getAddress();

      //transfer usd to user2 from owner
      await mockUSD
        .connect(owner)
        .transfer(user2.address, ethers.parseUnits("10000", 18));
      const user2Balance = await mockUSD.balanceOf(user2.address);
      expect(user2Balance).to.equal(ethers.parseUnits("10000", 18));

      //deposit usd
      await mockUSD
        .connect(user2)
        .approve(vaultAddress, ethers.parseUnits("10000", 18));
      await vault.connect(user2).deposit(ethers.parseUnits("10000", 18));

      // check USD balance of vault after user2 deposit
      const vaultBalanceAfterUser2 = await mockUSD.balanceOf(vaultAddress);
      expect(vaultBalanceAfterUser2).to.equal(ethers.parseUnits("10000", 18));

      // withdraw usd
      await vault.connect(user2).withdraw(ethers.parseUnits("10000", 18));

      //check vault balance after user2 withdraw
      const vaultBalanceAfterWd = await mockUSD.balanceOf(vaultAddress);
      expect(vaultBalanceAfterWd).to.equal(0);
    });
    it("User should not able to withdraw more than deposited amount", async function () {
      const { mockUSD, vault, owner, user1, user2 } =
        await deployVaultFixture();

      const vaultAddress = await vault.getAddress();

      await mockUSD
        .connect(owner)
        .transfer(user2.address, ethers.parseUnits("10000", 18));

      await mockUSD
        .connect(user2)
        .approve(vaultAddress, ethers.parseUnits("10000", 18));
      await vault.connect(user2).deposit(ethers.parseUnits("10000", 18));

      await expect(
        vault.connect(user2).withdraw(ethers.parseUnits("20000", 18))
      ).to.be.revertedWith("Insufficient balance to withdraw");
    });
  });
});
