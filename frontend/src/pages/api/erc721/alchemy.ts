import axios from "axios";

const alchemy_endpoint = process.env.ALCHEMY_API as string

export const getTokenIds = async (address: string, contract_address : string) => {
// Wallet address

// Alchemy URL
const url = `${alchemy_endpoint}/getNFTs/?owner=${address}&withMetadata=true`;

console.log(url,"hihi")

const config = {
    method: 'get',
    url: url,
};

// Make the request and print the formatted response:
const res = await axios(config)
const allOwnedNFTs= res.data.ownedNfts
console.log(res.data.ownedNfts)
console.log(res.data.ownedNfts[0].contract,res.data.ownedNfts[0].id)
let newArray = allOwnedNFTs.filter((nft: { contract: { address: string; }; }) => {
  return nft.contract.address == contract_address.toLowerCase();
} );
console.log(newArray, "awgewgwegw")

return (newArray)
}

