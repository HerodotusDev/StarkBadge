import axios from "axios";

const metadata_endpoint = process.env.NEXT_PUBLIC_METADATA_URL as string

export const handleGenerateProof = async (address:string, selectedTokenId:number) => {
    const res = await axios.post("/api/everai", {
      addr: address,
      tokenId: selectedTokenId,
    });
    const original = localStorage.getItem("proofs") || "{}"
   const json_original = JSON.parse(original)
   console.log(metadata_endpoint, "metadata")
   if(json_original[selectedTokenId]){
    json_original[selectedTokenId].push({"block_number":res.data.block_number ,"calldata": res.data.calldata, "metadata": `${metadata_endpoint}${selectedTokenId}` })
   }else {
    json_original[selectedTokenId] =  [{"block_number":res.data.block_number ,"calldata": res.data.calldata,"metadata": `${metadata_endpoint}${selectedTokenId}`}]

   }
  
    localStorage.setItem("proofs",JSON.stringify( json_original ));
    return res.data
  };


export const handleOwnedNFTs = async (address:string) => {
    const res = await axios.get("/api/ownednfts?addr=" + address);
    // console.log(res.data.nftList);
    return (res.data.nftList);
  };