// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/Verifier.sol";
import "hardhat/console.sol";

contract VerifierTest {
    Verifier public verifier;
    
    constructor() {
        verifier = new Verifier();
    }
    
    function testVerifyProof() public {
        // Create dummy proof data
        uint[2] memory a = [uint(1), uint(2)];
        uint[2][2] memory b = [[uint(3), uint(4)], [uint(5), uint(6)]];
        uint[2] memory c = [uint(7), uint(8)];
        uint[2] memory input = [uint(9), uint(10)];
        
        // Verify proof
        bool result = verifier.verifyProof(a, b, c, input);
        
        // In our simplified implementation, this should return true
        assert(result);
        
        console.log("Verifier.verifyProof test passed");
    }
    
    function testVerifyBatchProof() public {
        // Create dummy batch proof data
        uint[2][] memory a = new uint[2][](2);
        a[0] = [uint(1), uint(2)];
        a[1] = [uint(11), uint(12)];
        
        uint[2][2][] memory b = new uint[2][2][](2);
        b[0] = [[uint(3), uint(4)], [uint(5), uint(6)]];
        b[1] = [[uint(13), uint(14)], [uint(15), uint(16)]];
        
        uint[2][] memory c = new uint[2][](2);
        c[0] = [uint(7), uint(8)];
        c[1] = [uint(17), uint(18)];
        
        uint[2][] memory input = new uint[2][](2);
        input[0] = [uint(9), uint(10)];
        input[1] = [uint(19), uint(20)];
        
        // Verify batch proof
        bool[] memory results = verifier.verifyBatchProof(a, b, c, input);
        
        // In our simplified implementation, all results should be true
        assert(results.length == 2);
        assert(results[0]);
        assert(results[1]);
        
        console.log("Verifier.verifyBatchProof test passed");
    }
    
    function runTests() public {
        testVerifyProof();
        testVerifyBatchProof();
        console.log("All Verifier tests passed");
    }
}
