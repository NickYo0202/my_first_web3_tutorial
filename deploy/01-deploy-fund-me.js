// function deployFunction(){
//     console.log("this is a deploying FundMe contract...");
// }

const { getNamedAccounts, deployments, network } = require("hardhat");
const {developmentChains,networkConfig,LOCK_TIME} = require("../helper-hardhat-config");

// module.exports.default = deployFunction;
// module.exports = async(hre)=>{
//     const getNamedAccounts = hre.getNamedAccounts;
//     const deployments = hre.deployments;
//     console.log("this is a deploying FundMe contract...");
// }

module.exports = async({getNamedAccounts,deployments})=>{
    const {firstAccount} = await (getNamedAccounts());
    const {deploy} = deployments;
    let dataFeedAddress;
    let confirmations;
    if(developmentChains.includes(network.name)){
        const mockV3Aggregator = await deployments.get("MockV3Aggregator");
        dataFeedAddress = mockV3Aggregator.address;
        confirmations =0;
    }else{
        dataFeedAddress = networkConfig[network.config.chainId].ethUsdatafeeds;
        confirmations = 5;
    }

    const fundMe = await deploy("FundMe",{
        from:firstAccount,//合约由谁部署
        args:[LOCK_TIME,dataFeedAddress],//构造函数的入参
        log:true,//是否打印日志
        waitConfirmations: confirmations, //等待区块确认数
    });

 if(hre.network.config.chainId ==11155111 && process.env.ETHERSCAN_API_KEY){
      await hre.run("verify:verify",{
        address : fundMe.address,
        constructorArguments:[LOCK_TIME,dataFeedAddress],
      }
      )
    }else{
        console.log("no need to verify")
    }
      
    console.log("Deploying FundMe contract with account:",firstAccount);
}

module.exports.tags = ["all"];//给脚本打标签