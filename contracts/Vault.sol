pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract Vault is ReentrancyGuard {


    ERC20 public vaultStable;
    mapping(address => uint) private userBalances;

    event Deposit(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);

    constructor(ERC20 stableAddress) {
        vaultStable = ERC20(stableAddress);
    }

    function deposit(uint _amount) public nonReentrant {
        require(_amount > 0, "Invalid amount to deposit");
        userBalances[msg.sender] += _amount;
        vaultStable.transferFrom(msg.sender, address(this), _amount);
        emit Deposit((msg.sender), _amount);
    }

    function withdraw(uint _amount) public nonReentrant {
        require(userBalances[msg.sender] >= _amount, "Insufficient balance to withdraw");
        userBalances[msg.sender] -= _amount;
        vaultStable.transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    function getBalance() public view returns(uint) {
        return userBalances[msg.sender];
    }

}