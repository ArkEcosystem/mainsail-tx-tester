// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ERC20BatchTransfer {
    error LengthMismatch();

    // Single token => many recipients
    function batchTransferFrom(IERC20 token, address[] calldata to, uint256[] calldata amount) external {
        if (to.length != amount.length) {
            revert LengthMismatch();
        }

        for (uint256 i; i < to.length; i++) {
            require(token.transferFrom(msg.sender, to[i], amount[i]), "TRANSFER_FROM_FAILED");
        }
    }

    // Many token transfers in one call
    // tokens[i] => to[i] amount[i]
    function multiBatchTransferFrom(IERC20[] calldata tokens, address[] calldata to, uint256[] calldata amount)
        external
    {
        if (to.length != tokens.length || amount.length != tokens.length) {
            revert LengthMismatch();
        }

        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i].transferFrom(msg.sender, to[i], amount[i]), "TRANSFER_FROM_FAILED");
        }
    }
}
