// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/mocks/MockV3Aggregator.sol";

// contract MockV3Aggregator {
//     MockV3Aggregator public priceFeed;
    
//     constructor(uint8 _decimals, int256 _initialAnswer) {
//         // 初始化模拟价格预言机
//         priceFeed = new MockV3Aggregator(_decimals, _initialAnswer);
//     }
    
//     function getLatestPrice() public view returns (int256) {
//         // 获取最新价格
//         return priceFeed.latestAnswer();
//     }
    
//     function updatePrice(int256 _newPrice) public {
//         // 更新价格（仅用于测试）
//         priceFeed.updateAnswer(_newPrice);
//     }
// }