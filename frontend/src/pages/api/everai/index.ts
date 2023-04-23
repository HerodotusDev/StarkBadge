import type { NextApiRequest, NextApiResponse } from 'next'
import { herodotusProof, proofOfOwnership, starknetVerify } from '../erc721/proofs'
import { getCurrentBlockNum } from '../erc721/quicknode'
type ReturnData = {
  coupons: any
}

let contract_data = {
  address: '0xB6920Bc97984b454A2A76fE1Be5e099f461Ed9c8',
  mapping_storage_slot: 5,
  proof_blocknumber: 0
}

const post = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const address = req.body.addr as string
  const token_id = req.body.token_id as number
  // get latest block number
  contract_data.proof_blocknumber = await getCurrentBlockNum()

  console.log(contract_data.proof_blocknumber)

  //get proof of ownership of everai
  const proofOwnership = await proofOfOwnership(address,token_id, contract_data.address, contract_data.proof_blocknumber, contract_data.mapping_storage_slot)
  if (!proofOwnership) return res.status(500).json([])
  console.log(proofOwnership,"proofOwnership")
  //generate check user's proof and validate it send it to factregistery
  await herodotusProof(contract_data.address, proofOwnership?.blockNum )
  
  // after passing herodotus validation, we can get proof from ethereum and starknetverify it. Why? we need this for get_storage_uint for factregistery
  const calldata = await starknetVerify(contract_data.address, proofOwnership?.slot, proofOwnership?.blockNum)

  return res.status(200).json(calldata)
}


const get = async (req: NextApiRequest, res: NextApiResponse<ReturnData>) => {
  const address = req.query.addr as string
  const token_id = req.body.token_id as number

  const blockNum = await getCurrentBlockNum()
  const proofOwnership = await proofOfOwnership(address,token_id, contract_data.address, blockNum, contract_data.mapping_storage_slot)
  res.status(200).json({
    coupons: {
      "proofOwnership": proofOwnership ? true : false,
    }
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnData>
) {
  if (req.method === 'GET') {
    get(req, res)
  } else if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).end()
  }
}
