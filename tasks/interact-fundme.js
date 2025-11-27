const {task} = require("hardhat/config");

task("interact-fundme","interact with fundme contract")
.addParam("addr","fundme contract address")
.setAction(async (taskArgs, hre) => {
    const fundMeFactory  = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);
    //init 2 accounts
        const [deployer,account1] = await ethers.getSigners();
        console.log(`deployer address is ${deployer.address}`);
        console.log(`account1 address is ${account1.address}`);
        //fund contract with first account
        const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")});//0.5 ETH ethers.parseEther 将ETH转换为wei单位
        await fundTx.wait();//等待交易成功
    
        //check balance of contract
        const contractBalance = await ethers.provider.getBalance(fundMe.target);
        console.log(`contract balance is ${ethers.formatEther(contractBalance)} ETH`);
    
        //fund contract with second account
        const fundTxWithSecondAccount =  await fundMe.connect(account1).fund({value: ethers.parseEther("0.5")});
        //上一个没有connect是因为默认用的是deployer，如果要用别的acc，要用connect切换
        await fundTxWithSecondAccount.wait();
        //check balance of contract now
        const contractBalanceNow = await ethers.provider.getBalance(fundMe.target);
        console.log(`contract balance now is ${ethers.formatEther(contractBalanceNow)} ETH`);
    
        //check mapping
        const firstAccountBalanceOfContract = await fundMe.fundersToAmount(deployer.address);
        console.log(`balance of first account ${deployer.address} has funded ${firstAccountBalanceOfContract} ETH`);
       
        await fundMe.fundersToAmount(account1.address).then((amount)=>{
            console.log(`account1 has funded ${ethers.formatEther(amount)} ETH`);
        });
});