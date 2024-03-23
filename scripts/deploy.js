const hre = require("hardhat");

async function main(){
   const metaDataURL = "ipfs://QmZjiVjNgswJ8kVqvXVZNiQsMXfPdJtLFrUnvziwzS9wys/";
   
   const movieNFTCollectionFactory = await hre.ethers.getContractFactory("MovieNFTCollection");
   const movieNFTCollection = await movieNFTCollectionFactory.deploy(metaDataURL);
   await movieNFTCollection.waitForDeployment();

   console.log(movieNFTCollection.target); //0xD96D37259057a9E231d942101a0949DC87296766
   console.log(hre.network.config.chainId);
   if (hre.network.config.chainId === 11155111 && process.env.Etherscan_API_KEY) {
    console.log(`waiting for 6 confirmation.`);
    await movieNFTCollection.deploymentTransaction().wait(6);
    await verify(movieNFTCollection.target,[metaDataURL]);
   }
}

async function verify(contractAddress,args){
    console.log(`verifying contract address..`);
    try {
      await hre.run(`verify:verify`,{
        address: contractAddress,
        constructorArguments: args,
      })
    } catch (error) {
      if (error.message.toLowerCase().includes(`already verified`)) {
        console.log(`Already verified`);
      }else{
        console.log(error);
      }
    }
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });