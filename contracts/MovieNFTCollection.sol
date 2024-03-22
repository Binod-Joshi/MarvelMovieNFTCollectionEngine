// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24; 

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MovieNFTCollection is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseTokenURI;
    uint256 public constant price = 0.01 ether;
    bool public paused;
    uint256 public constant maxNumOfTokenId = 15;
    uint256 public tokenMinted = 0;

    modifier onlyWhenNotPaused {
        require(!paused, "Contract currently paused");
        _;
    }

    constructor(string memory baseURI) ERC721("MovieNftCollectionByBinod","MovieBJ") Ownable(msg.sender){
        baseTokenURI = baseURI;
    }

    function mint() public payable onlyWhenNotPaused {
        require(tokenMinted < maxNumOfTokenId, "Exceed maximum num of move NFT.");
        require(msg.value >= price, "Not enough ether to mint NFT");
        _safeMint(msg.sender, tokenMinted);
        tokenMinted ++;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setPaused(bool _val) public onlyOwner {
        paused = _val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
    
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

}