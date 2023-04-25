export const factoryABI = [
    {
        "members": [
            {
                "name": "low",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "high",
                "offset": 1,
                "type": "felt"
            }
        ],
        "name": "Uint256",
        "size": 2,
        "type": "struct"
    },
    {
        "data": [
            {
                "name": "from_",
                "type": "felt"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "Transfer",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "approved",
                "type": "felt"
            },
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "Approval",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "operator",
                "type": "felt"
            },
            {
                "name": "approved",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "fromTokenId",
                "type": "Uint256"
            },
            {
                "name": "toTokenId",
                "type": "Uint256"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "TransferValue",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "tokenId",
                "type": "Uint256"
            },
            {
                "name": "operator",
                "type": "felt"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "ApprovalValue",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "tokenId",
                "type": "Uint256"
            },
            {
                "name": "oldSlot",
                "type": "Uint256"
            },
            {
                "name": "newSlot",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "SlotChanged",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "operator",
                "type": "felt"
            },
            {
                "name": "approved",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "ApprovalForSlot",
        "type": "event"
    },
    {
        "inputs": [
            {
                "name": "coupon_address",
                "type": "felt"
            }
        ],
        "name": "add_coupon",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "coupon_address",
                "type": "felt"
            },
            {
                "name": "verify_requirements_len",
                "type": "felt"
            },
            {
                "name": "verify_requirements",
                "type": "felt*"
            }
        ],
        "name": "mint_coupon",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "name",
                "type": "felt"
            },
            {
                "name": "symbol",
                "type": "felt"
            },
            {
                "name": "decimals",
                "type": "felt"
            }
        ],
        "name": "constructor",
        "outputs": [],
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "name",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "symbol",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "name": "owner",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "name": "approved",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "operator",
                "type": "felt"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "name": "isApproved",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "totalSupply",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "index",
                "type": "Uint256"
            }
        ],
        "name": "tokenByIndex",
        "outputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "index",
                "type": "Uint256"
            }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "interfaceId",
                "type": "felt"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "name": "success",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "valueDecimals",
        "outputs": [
            {
                "name": "decimals",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "valueOf",
        "outputs": [
            {
                "name": "balance",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "slotOf",
        "outputs": [
            {
                "name": "slot",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            },
            {
                "name": "operator",
                "type": "felt"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "slot",
                "type": "Uint256"
            }
        ],
        "name": "totalValue",
        "outputs": [
            {
                "name": "total",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "operator",
                "type": "felt"
            },
            {
                "name": "approved",
                "type": "felt"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "from_",
                "type": "felt"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "from_",
                "type": "felt"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "tokenId",
                "type": "Uint256"
            },
            {
                "name": "data_len",
                "type": "felt"
            },
            {
                "name": "data",
                "type": "felt*"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            },
            {
                "name": "operator",
                "type": "felt"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "name": "approveValue",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "fromTokenId",
                "type": "Uint256"
            },
            {
                "name": "toTokenId",
                "type": "Uint256"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "name": "transferValueFrom",
        "outputs": [
            {
                "name": "newTokenId",
                "type": "Uint256"
            }
        ],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "operator",
                "type": "felt"
            },
            {
                "name": "approved",
                "type": "felt"
            }
        ],
        "name": "setApprovalForSlot",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "operator",
                "type": "felt"
            }
        ],
        "name": "isApprovedForSlot",
        "outputs": [
            {
                "name": "is_approved",
                "type": "felt"
            }
        ],
        "type": "function"
    },
    {
        "inputs": [],
        "name": "slotCount",
        "outputs": [
            {
                "name": "count",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "index",
                "type": "Uint256"
            }
        ],
        "name": "slotByIndex",
        "outputs": [
            {
                "name": "slot",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "slot",
                "type": "Uint256"
            }
        ],
        "name": "tokenSupplyInSlot",
        "outputs": [
            {
                "name": "totalAmount",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "index",
                "type": "Uint256"
            }
        ],
        "name": "tokenInSlotByIndex",
        "outputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractURI",
        "outputs": [
            {
                "name": "uri_len",
                "type": "felt"
            },
            {
                "name": "uri",
                "type": "felt*"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "slot",
                "type": "Uint256"
            }
        ],
        "name": "slotURI",
        "outputs": [
            {
                "name": "uri_len",
                "type": "felt"
            },
            {
                "name": "uri",
                "type": "felt*"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "name": "uri_len",
                "type": "felt"
            },
            {
                "name": "uri",
                "type": "felt*"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "index",
                "type": "Uint256"
            }
        ],
        "name": "tokenIndexInSlot",
        "outputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenId",
                "type": "Uint256"
            },
            {
                "name": "amounts_len",
                "type": "felt"
            },
            {
                "name": "amounts",
                "type": "Uint256*"
            }
        ],
        "name": "split",
        "outputs": [
            {
                "name": "token_ids_len",
                "type": "felt"
            },
            {
                "name": "token_ids",
                "type": "Uint256*"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "tokenIds_len",
                "type": "felt"
            },
            {
                "name": "tokenIds",
                "type": "Uint256*"
            }
        ],
        "name": "merge",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "token_id",
                "type": "Uint256"
            },
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "slot",
                "type": "Uint256"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "name": "mintNew",
        "outputs": [
            {
                "name": "token_id",
                "type": "Uint256"
            }
        ],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "token_id",
                "type": "Uint256"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "name": "mintValue",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "token_id",
                "type": "Uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "token_id",
                "type": "Uint256"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "name": "burnValue",
        "outputs": [],
        "type": "function"
    }
]
