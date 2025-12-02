// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    uint256 private counter;

    error InvalidValue();
    error InvalidValueWithAttributes(string reason, uint256 code);

    constructor() {
        counter = 0;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function setCounter(uint256 newCounter) public {
        counter = newCounter;
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