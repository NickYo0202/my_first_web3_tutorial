const {DECIMAL,INITIAL_ANSWER,developmentChains} = require("../helper-hardhat-config"); 

module.exports = async({getNamedAccounts,deployments})=>{

if(developmentChains.includes(network.name)){
const {firstAccount} = await getNamedAccounts();
    const {deploy} = deployments;
    await deploy("MockV3Aggregator",{
        from:firstAccount,//合约由谁部署
        args:[DECIMAL, INITIAL_ANSWER],//构造函数的入参
        log:true,//是否打印日志
    });
    console.log("Deploying mock datafeed contract with account:",firstAccount);
}else{
    console.log("You are on a live network, no need to deploy mocks!");
}
}

module.exports.tags = ["all","mock"];//给脚本打标签