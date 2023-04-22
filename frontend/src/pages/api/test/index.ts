import type { NextApiRequest, NextApiResponse } from 'next'
import { herodotusProof, proofOfOG, starknetVerify } from '../erc721/proofs'
import { getCurrentBlockNum } from '../erc721/quicknode'

type ReturnData = {
  coupons: any
}

let contract_data = {
  address: '0x328507DC29C95c170B56a1b3A758eB7a9E73455c',
  creation_tx: '0xc2349c284ec8ec5cd8d735bb971583ef49d6d04d5048cd34adf994ce326642fd',
  genesisBlock: -1,
  storage_slot_balance: 0
}

const post = async (req: NextApiRequest, res: NextApiResponse<any>) => {
//   const address = req.body.addr as string
//   if (contract_data.genesisBlock == -1) {
//     contract_data.genesisBlock = await getCurrentBlockNum()
//   }
//   const proofOG = await proofOfOG(address, contract_data.address, contract_data.genesisBlock, contract_data.storage_slot_balance)
//   if (!proofOG) return res.status(500).json([])

//   await herodotusProof(contract_data.address, proofOG?.blockNum)
//   const calldata = await starknetVerify(contract_data.address, proofOG?.slot, proofOG?.blockNum)

  const current_block =  await getCurrentBlockNum()

  return res.status(200).json({block : current_block})
}


const get = async (req: NextApiRequest, res: NextApiResponse<ReturnData>) => {
  const address = req.query.addr as string
  const blockNum = contract_data.genesisBlock == -1 ? await getCurrentBlockNum() : contract_data.genesisBlock
  const proofOG = await proofOfOG(address, contract_data.address, blockNum, contract_data.storage_slot_balance)
  res.status(200).json({
    coupons: {
      "proofOfOG": proofOG ? true : false,
    }
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnData>
) {
  if (req.method === 'GET') {
    post(req, res)
  } else if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).end()
  }
}
