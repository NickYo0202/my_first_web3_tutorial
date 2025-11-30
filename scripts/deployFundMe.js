//import ethers.js
//create main function
//execute main function
const { ethers } = require("hardhat");

async function main(){
    //获取合约工厂，通过合约工厂部署合约，
    // 但是需要注意的是创建工厂和部署合约都是异步操作需要等待每一步的结果才能进行下一步
    // 所以函数用async修饰函数，用await等待异步操作完成
    //create factory 
    const fundMeFactory  = await ethers.getContractFactory("FundMe");
    console.log("deploying contract....");
    //deploy contract
    const fundMe = await fundMeFactory.deploy(10,"0x694AA1769357215DE4FAC081bf1f309aDC325306");
    await fundMe.deployed();
    console.log(`contract has been deployed successfully,contract address is ${fundMe.address}`);
    //verify contract on etherscan
    if(hre.network.config.chainId ==11155111 && process.env.ETHERSCAN_API_KEY){
       console.log("verifying contract....");
        await fundMe.deployTransaction;//避免验证失败，等待6个区块确认
        await verify(fundMe.address,[10,"0x694AA1769357215DE4FAC081bf1f309aDC325306"]);
    }else{
        console.log("skip verification");
    }

    //init 2 accounts
    // const [deployer,account1] = await ethers.getSigners();
    // console.log(`deployer address is ${deployer.address}`);
    // console.log(`account1 address is ${account1.address}`);
    // //fund contract with first account
    // const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")});//0.5 ETH ethers.parseEther 将ETH转换为wei单位
    // await fundTx.wait();//等待交易成功

    // //check balance of contract
    // const contractBalance = await ethers.provider.getBalance(fundMe.target);
    // console.log(`contract balance is ${ethers.formatEther(contractBalance)} ETH`);

    // //fund contract with second account
    // const fundTxWithSecondAccount =  await fundMe.connect(account1).fund({value: ethers.parseEther("0.5")});
    // //上一个没有connect是因为默认用的是deployer，如果要用别的acc，要用connect切换
    // await fundTxWithSecondAccount.wait();
    // //check balance of contract now
    // const contractBalanceNow = await ethers.provider.getBalance(fundMe.target);
    // console.log(`contract balance now is ${ethers.formatEther(contractBalanceNow)} ETH`);

    // //check mapping
    // const firstAccountBalanceOfContract = await fundMe.fundersToAmount(deployer.address);
    // console.log(`balance of first account ${deployer.address} has funded ${firstAccountBalanceOfContract} ETH`);
   
    // await fundMe.fundersToAmount(account1.address).then((amount)=>{
    //     console.log(`account1 has funded ${ethers.formatEther(amount)} ETH`);
    // });

}
 async function verify(address,args){
        await hre.run("verify:verify", {
        address: address,
        constructorArguments: [args],
        });
    }

main().then().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
});