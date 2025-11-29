
const{ethers, deployments, getNamedAccounts,network} = require("hardhat");
const {assert, expect} = require("chai");
const {developmentChains} = require("../../helper-hardhat-config");
// const helpers  = require("@nomicfoundation/hardhat-network-helpers");
!developmentChains.includes(network.name)?  describe.skip 
: describe("test fundme contract", async function(){
    let fundMe;
    let firstAccount;
    let secondAccount;
    let fundMeSecondAccount;
    beforeEach(async function(){
    await deployments.fixture(["all"]);
    firstAccount = (await getNamedAccounts()).firstAccount;
    const fundMeDeployment = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe",fundMeDeployment.address);
    secondAccount = (await getNamedAccounts()).secondAccount;
    fundMeSecondAccount = await ethers.getContractAt("FundMe",fundMe.address,await ethers.getSigner(secondAccount));
})
    
    it("test if the owner is msg.sender",async function(){
        // await fundMe.waitForDeployment();
        assert.equal((await fundMe.owner()),firstAccount);
    })

    //fund ,getFund ,refund
    //unit test for fund
    //window open ,value greater than minium value,funder balance
    it ("window closed,value greater than minium ,fund failed",
        async function(){
            //make sure window is closed
        await network.provider.send("evm_increaseTime", [500]);
        await network.provider.send("evm_mine");
        //value is greater than minium value
        expect(fundMe.fund({value:ethers.utils.parseEther("0.1")}))
        .to.be.revertedWith("window is closed!");
    })

    it("window open,value is less than minium value,fund failed",
    async function(){
        //value is less than minium value
        //expect 前不加await测试永远是成功的，所以要加await
        await expect(fundMe.fund({value:ethers.utils.parseEther("0.001")}))
        .to.be.revertedWith("You need to fund more ETH!");
    })

    it("window open,value greater than minium value,fund success",
    async function(){
       await fundMe.fund({value: ethers.utils.parseEther("0.1")})
        const balance = await fundMe.fundersToAmount(firstAccount)
        await expect(balance).to.equal(ethers.utils.parseEther("0.1"));
    })

    //unit test for getFund 
    //onlyOwner,window closed,balance is enough
    it("not ownwer,window closed,balance is enough,getFund failed"
        ,async function(){
            //make sure target is reached
            await fundMe.fund({value: ethers.utils.parseEther("1")});
            //make sure window is closed
            await network.provider.send("evm_increaseTime", [500]);
            await network.provider.send("evm_mine");
            //not owner
            await expect(fundMeSecondAccount.getFund()).to.be.revertedWith("this function can only be called by owner");
        })

        //test target reached
        it("window open,target reached,get fund failed",
        async function(){
            await fundMe.fund({value: ethers.utils.parseEther("1")});
            //make sure window is open
            await expect(fundMe.getFund()).to.be.revertedWith("window is not closed");
        })

        //window closed ,target is not reached
        it("window closed,target is not reached,get fund failed",
        async function(){
            await fundMe.fund({value: ethers.utils.parseEther("0.1")});
            //make sure window is closed
            await network.provider.send("evm_increaseTime", [500]);
            await network.provider.send("evm_mine");
            await expect(fundMe.getFund()).to.be.revertedWith("target is not reached");
        })

        it("window closed,target is reached,get fund success",
        async function(){
            //fund enough
            await fundMe.fund({value: ethers.utils.parseEther("1")});
            //make sure window is closed
            await network.provider.send("evm_increaseTime", [500]);
            await network.provider.send("evm_mine");
            //get balance before getFund
            //getFund() 成功执行时，会在合约上发出 FundWithdrawByOwner 事件，且事件参数为 1 ETH
            await expect(fundMe.getFund()).to.emit(fundMe,"FundWithdrawByOwner").withArgs(ethers.utils.parseEther("1"));
        })
    
        //todo 还有refund的单元测试没写
})