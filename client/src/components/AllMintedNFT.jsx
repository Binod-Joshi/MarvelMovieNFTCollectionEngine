import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./AllMintedNFT.css"

const AllMintedNFT = () => { 
    const params = useParams();
    const metaDataCID = params.baseUrlOfNFT;
    const numOfMintedToken = params.tokenIdsMinted;
    const [metaDataCollection, setMetaDataCollection] = useState([]);

    console.log(metaDataCID, numOfMintedToken);
    
    const getAllMintedNFT = async () => {
      let fetchedData = [];
      
      for (let index = 0; index < numOfMintedToken; index++) {
        console.log("trying to get metaData of all NFT");
        console.log(index);
        try {
          let metaDataOfNFT = await fetch(`https://ipfs.io/ipfs/${metaDataCID}/${index}.json`);
    
          if (metaDataOfNFT.ok) {
            console.log(metaDataOfNFT);
            try {
              metaDataOfNFT = await metaDataOfNFT.json();
              fetchedData.push(metaDataOfNFT);
              console.log("The meta of NFT collection is ", metaDataOfNFT);
            } catch (error) {
              console.log("Non-JSON response received:", await response.text());
            }
          } else {
            console.error("HTTP error:", response.statusText);
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      
      // Filter out duplicates before updating state
      const uniqueData = fetchedData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.name === item.name && t.description === item.description
        ))
      );
    
      if (metaDataCollection.length < numOfMintedToken) {
        console.log(metaDataCollection.length);
        setMetaDataCollection(prevState => [...prevState, ...uniqueData]);
      }
    };

    useEffect(() => {
      console.log("hei");
        getAllMintedNFT();
  }, [numOfMintedToken]);

    console.log(metaDataCollection);

  return (
    <div>
      <div className='files'>
        {metaDataCollection && metaDataCollection.slice(0,numOfMintedToken)?.map((fileData, index) => {
          let image = fileData?.image.split("//");
          image = import.meta.env.VITE_DOMAIN_PINATA_GATEWAY + image[1];
          console.log(image);
          return(
            <div className='singleFile' key={index}>
              <img src={image} className='image' alt="" />
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", width:"96%"}}>
                <p style={{display:"flex", alignItems:"center", justifyContent:"center", width:"96%"}}>Name: {fileData.name}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllMintedNFT
