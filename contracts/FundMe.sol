// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//1.创建一个收款函数 payable关键字标识函数有收款功能
//2.记录投资人并且查看
//3.在锁定期内，达到目标值，生产商可以提款
//4.在锁定期内，没有达到目标值，投资人在锁定期以后退款

contract FundMe{
    mapping(address => uint256) public fundersToAmount;
    uint256 MINIMUM_VALUE = 100*10**18;  //1ETH = 10^18 wei
    //以美元为单位时
    AggregatorV3Interface internal dataFeed;
    //constans——常量关键值
    uint256 constant TARGET = 1000 * 10 **18;

    //合约部署的时间戳
    uint256 deploymentTimestamp;
    //锁定时长
    uint256 lockTime;
    
    address public  owner;

    address erc20Addr;
    bool public getFundSuccess;
    constructor(uint256 _lockTime){
        //这里用的是sepolia测试网地址
        dataFeed =AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }
    function fund() external payable {
        require(convertEth2Usd(msg.value)>=MINIMUM_VALUE,unicode"需要更多的eth");
        require(block.timestamp < deploymentTimestamp+lockTime,"window is closed");
         fundersToAmount[msg.sender] = msg.value;
    }

      /**
   * Returns the latest answer.
   */
  function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
    // prettier-ignore
    (
      /* uint80 roundId */
      ,
      int256 answer,
      /*uint256 startedAt*/
      ,
      /*uint256 updatedAt*/
      ,
      /*uint80 answeredInRound*/
    ) = dataFeed.latestRoundData();
    return answer;
  }
  //转换eth到usd
  function convertEth2Usd(uint256 ethAmount) internal view returns (uint256){
    uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
    return ethAmount * ethPrice / (10**8);
  }

  function transferOwnership(address newOwner) public onlyOwner{
    // require(msg.sender == owner,"this function can only be called by owner");
    owner = newOwner;
  }

    function getFund() external windowClosed onlyOwner{
      //获取当前合约里的余额是不是达到常量设定的值
      require(convertEth2Usd(address(this).balance) >= TARGET,"target is not reached");
      //要限制谁可以提取
      // require(msg.sender == owner,"this function can only be called by owner");
      //transfer 纯转账： transfer ETH and revert if tx failed
      //addr.transfer(value)
      // payable(msg.sender).transfer(address(this).balance);
      //send 只能纯转账: transfer ETH and return false if failed 
      //bool success = payable(msg.sender).send(address(this).balance);
      //require(success,"tx failed");
      //call :可以处理纯转账和处理数据: transfer ETH with data return value of function and bool 
      //(bool , result)addr.call{value : value}("data");
      bool success;
      (success,) = payable(msg.sender).call{value : address(this).balance}("");
      require(success,"transfer tx failed");
      fundersToAmount[msg.sender] = 0;
      getFundSuccess = true;
    }

    function refund() external windowClosed{
      require(convertEth2Usd(address(this).balance) < TARGET,"target is reached");
      //先检测当前地址有没有存在之前记录的fundermapping中
      require(fundersToAmount[msg.sender] != 0,"there is no fund for you");
      bool success;
      (success,) = payable(msg.sender).call{value : fundersToAmount[msg.sender]}("");
      require(success,"transfer tx failed");
      //交易成功时，mapping里的值清零
      fundersToAmount[msg.sender] = 0;
    }

    function setFunderToAmount(address funder,uint256 amountToUpdate) external {
      require(msg.sender == erc20Addr,"you do not have permission to call this function");
      fundersToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner{
      erc20Addr = _erc20Addr;
    }

    modifier windowClosed(){
      require(block.timestamp >= deploymentTimestamp+lockTime,"window is not closed");
      _;//下划线在后面，是先执行上面的判断，再执行之后的操作
    }

    modifier onlyOwner(){
      require(msg.sender == owner,"this function can only be called by owner");
      _;
    }
}