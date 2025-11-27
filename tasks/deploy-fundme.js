const {task} = require("hardhat/config");

task("deploy-fundme","deploy and verify fundme contract")
.setAction(async (taskArgs, hre) => {
  //create factory 
      const fundMeFactory  = await ethers.getContractFactory("FundMe");
      console.log("deploying contract....");
      //deploy contract
      const fundMe = await fundMeFactory.deploy(10);
      await fundMe.waitForDeployment();
      console.log(`contract has been deployed successfully,contract address is ${fundMe.target}`);
      //verify contract on etherscan
      if(hre.network.config.chainId ==11155111 && process.env.ETHERSCAN_API_KEY){
         console.log("verifying contract....");
          await fundMe.deploymentTransaction().wait(6);//避免验证失败，等待6个区块确认
          await verify(fundMe.target,[10]);
      }else{
          console.log("skip verification");
      }

});

async function verify(address,args){
        await hre.run("verify:verify", {
        address: address,
        constructorArguments: [args],
        });
    }