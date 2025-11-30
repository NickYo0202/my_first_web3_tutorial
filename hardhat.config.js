

require("@nomiclabs/hardhat-ethers");
require("@chainlink/env-enc").config();
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");
require("./tasks/deploy-fundme");
require("./tasks/interact-fundme");
require("hardhat-deploy");
require("hardhat-coverage")

const INFLURA_SEPOLIA_URL = process.env.INFLURA_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
// const {setGlobalDispatcher,ProxyAgent} = require("undici");
// const proxyAgent = new ProxyAgent('http://127.0.0.1:10809')
// setGlobalDispatcher(proxyAgent);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat", 
  mocha: {
    timeout: 400000 // 500 seconds max for running tests
  },
  networks: {
    sepolia: {
      url: INFLURA_SEPOLIA_URL,
      accounts: [PRIVATE_KEY,PRIVATE_KEY_1],
      chainId: 11155111,
    }
  },

  etherscan: {
    // Your API key for Etherscan
      apiKey: {
      sepolia: "J1FXM4MFQ68J1PA6UXYBKG1ADMT7EK87R4"
      },
      customChains: [{
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api?chainid=11155111",
          browserURL: "https://sepolia.etherscan.io"
        } 
      }],
    
  },
  namedAccounts: {
    firstAccount: {
      default: 0, // here this will by default take the first account as firstAccount
    },
    secondAccount:{
      default:1,
    }
  }
};
