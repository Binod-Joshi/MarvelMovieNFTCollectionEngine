import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const AllMintedNFT = () => {
    const params = useParams();
    const metaDataCID = params.baseUrlOfNFT;
    const numOfMintedToken = params.tokenIdsMinted;

    console.log(metaDataCID,numOfMintedToken);
    
    const getAllMintedNFT = async() => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllMintedNFT();
    },[])

  return (
    <div>
      "minted NFT"
    </div>
  )
}

export default AllMintedNFT
