// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Verifier {
    /**
     * @dev Verify a single proof. Always returns true in this simplified stub.
     */
    function verifyProof(bytes memory /* proof */, uint256[] memory /* pubSignals */) public pure returns (bool) {
        return true;
    }
}
