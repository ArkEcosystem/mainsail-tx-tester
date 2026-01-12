// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test2 {
    uint256 private counter;

    error InvalidValue();
    error InvalidValueWithAttributes(string reason, uint256 code);

    constructor(uint256 initialCounter, uint256 divisor) {
        counter = initialCounter / divisor;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function setCounter(uint256 newCounter) public {
        counter = newCounter;
    }

    // Used to throw division by zero errors
    function divideCounter(uint256 divisor) public view returns (uint256) {
        return counter / divisor;
    }

    function setCounterAndReturn(uint256 newCounter) public returns (uint256) {
        counter = newCounter;
        return counter;
    }

    function incrementCounter() public {
        counter++;
    }

    function useRevert() public {
        counter = 0;
        revert("This is a reverted transaction");
    }

    function useRevertView() public pure {
        revert("This is a reverted transaction");
    }

    function useError() public {
        counter = 0;
        revert InvalidValue();
    }

    function useErrorView() public pure {
        revert InvalidValue();
    }

    function useErrorWithAttributes() public {
        counter = 0;
        revert InvalidValueWithAttributes("Custom reason", 42);
    }

    function useErrorWithAttributesView() public pure {
        revert InvalidValueWithAttributes("Custom reason", 42);
    }
}