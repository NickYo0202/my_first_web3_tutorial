
const{ethers, deployments, getNamedAccounts,network} = require("hardhat");
const {assert, expect} = require("chai");
const {developmentChains} = require("../../helper-hardhat-config");
// const helpers  = require("@nomicfoundation/hardhat-network-helpers");
developmentChains.includes(network.name)?  describe.skip 
: describe("test fundme contract", async function(){
    let fundMe;
    let firstAccount;

    beforeEach(async function(){
    await deployments.fixture(["all"]);
    firstAccount = (await getNamedAccounts()).firstAccount;
    const fundMeDeployment = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe",fundMeDeployment.address);
})
    //test fund and getFund successfully
    it("fund and getFund successfully",async function(){
        //make sure target is reached
        await fundMe.fund({value: ethers.utils.parseEther("1")});
        //make sure window is closed
        await new Promise(resolve => setTimeout(resolve, 301 * 1000));
        //make sure we can get receipt
        const getFundTx = await fundMe.getFund();
        const getFundReceipt = await getFundTx.wait();//等待交易成功入块
        expect(getFundReceipt).to
        .emit(fundMe,"FundWithdrawByOwner")
        .withArgs(ethers.utils.parseEther("1"));
    })

    //test fund and refund successfully
    it("fund and refund successfully",async function(){
        //make sure target is reached
        await fundMe.fund({value: ethers.utils.parseEther("0.1")});  
        //make sure window is closed
        await new Promise(resolve => setTimeout(resolve, 301 * 1000));
        //make sure we can get receipt
        const refundTx = await fundMe.refund();
        const refundReceipt = await refundTx.wait();//等待交易成功入块
        expect(refundReceipt).to
        .emit(fundMe,"RefundToFunder")
        .withArgs(firstAccount,ethers.utils.parseEther("0.1"));
    })

})