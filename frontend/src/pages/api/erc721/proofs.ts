import { ethers } from 'ethers'
import { ethGetProof, ethGetStorageAt, getCurrentBlockNum } from './quicknode'
import { Data } from "../utils/data"
import { BigNumber } from "ethers"

export const proofOfOwnership = async (address:string, token_id: number, contract_address: string, block_number: number, mapping_storage_slot: number) => {
  
 
  /*
  const blocks_lookup = 1000
  const creation_block = await getTxBlockNum(contract_creation_tx)
  const creation_block = block_number
  const txs = await getTxsInBlockInterval(creation_block, creation_block + blocks_lookup, contract_address, address)
  */


  const balance_slot_keccak = ethers.utils.keccak256(
    ethers.utils.concat([
      ethers.utils.defaultAbiCoder.encode(
        ['uint256'],
        [token_id]
      ),
      ethers.utils.defaultAbiCoder.encode(
        ['uint256'],
        [mapping_storage_slot]
      )
    ])
  ) 
  return { blockNum: block_number, slot: balance_slot_keccak }
}

export const herodotusProof = async (address: string, blockNum: number) => {
  const herodotus_endpoint = process.env.HERODOTUS_API as string
  const herodotus_api_key = process.env.HERODOTUS_API_KEY as string
  const body = {
    originChain: "GOERLI",
    destinationChain: "STARKNET_GOERLI",
    blockNumber: blockNum,
    type: "ACCOUNT_ACCESS",
    requestedProperties: {
      ACCOUNT_ACCESS: {
        account: address,
        properties: [
          "storageHash"
        ]
      }
    },
  }

  const response = await fetch(herodotus_endpoint + '?apiKey=' + herodotus_api_key, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return data;
}

export const starknetVerify = async (address: string, slot: string, blockNum: number) => {
  const ethProof = await ethGetProof(address, [slot], blockNum)
  const rawProof = ethProof.storageProof[0].proof;
  const proof = rawProof.map((leaf: any) => Data.fromHex(leaf).toInts());
 
  const flatProofByteLengths: number[] = [];
  const flatProofWordLengths: number[] = [];
  let flatProofValues: BigNumber[] = [];

  for (const element of proof) {
    flatProofByteLengths.push(element.sizeBytes);
    flatProofWordLengths.push(element.values.length);
    flatProofValues = flatProofValues.concat(element.values);
  }

  const slot_from_hex = Data.fromHex(slot)
    .toInts()
    .values.map((value: any) => value.toHexString())

  // const calldata = [
  //   BigNumber.from(blockNum).toHexString(),
  //   address,
  //   ...slot_from_hex,
  //   BigNumber.from(flatProofByteLengths.length).toHexString(),
  //   ...flatProofByteLengths.map((length) => "0x" + length.toString(16)),
  //   BigNumber.from(flatProofWordLengths.length).toHexString(),
  //   ...flatProofWordLengths.map((length) => "0x" + length.toString(16)),
  //   BigNumber.from(flatProofValues.length).toHexString(),
  //   ...flatProofValues.map((value) => value.toHexString()),
  // ]

 

  const output = {
    proof_sizes_bytes : flatProofByteLengths.map((length) => "0x" + length.toString(16)), proof_sizes_words: flatProofWordLengths.map((length) => "0x" + length.toString(16)), proofs_concat: flatProofValues.map((value) => value.toHexString()),
  }

  return output
}
