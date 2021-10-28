import React from "react";

const NFTImage = (props) => {
  return (
    <div className={`nft-image-wrapper ${props.class}`}>
      <div className="total-nft">NFT's Total Mint: {props.totalNFT}/999</div>
      <div className="user-minted-nft">You've Minted: {props.userMinted}</div>
      <div className="nft-card-container">
        <div className="nft-card-item">
          {props.base64Image && <img src={props.base64Image} alt={"nft"} />}
        </div>
      </div>
    </div>
  );
};

export default NFTImage;