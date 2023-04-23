import axios from "axios";

export const handleGenerateProof = async (address:string, selectedTokenId:number) => {
    const res = await axios.post("/api/everai", {
      addr: address,
      tokenId: selectedTokenId,
    });
    console.log(res);
    console.log("hihi");
  };


export const handleOwnedNFTs = async (address:string) => {
    const res = await axios.get("/api/ownednfts?addr=" + address);
    console.log(res.data.nftList);
    return (res.data.nftList);
  };