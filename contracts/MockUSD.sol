pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockUSD is ERC20 {

    uint PRECISION = 1e18;

    constructor() ERC20("MockUSD", "MUSD")  {
        _mint(msg.sender, 1000000 * PRECISION);
    }
}