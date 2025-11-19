// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestContract {
    uint256 private counter;

    constructor() {
        counter = 0;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function setCounter(uint256 newCounter) public {
        counter = newCounter;
    }
}