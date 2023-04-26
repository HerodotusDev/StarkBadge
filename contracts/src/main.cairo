%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.signature import check_ecdsa_signature
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.cairo_builtins import EcOpBuiltin
from starkware.cairo.common.bool import FALSE, TRUE
from starkware.cairo.common.cairo_keccak.keccak import (
    finalize_keccak,
    cairo_keccak_uint256s
)

from openzeppelin.token.erc721.library import ERC721
from openzeppelin.introspection.erc165.library import ERC165
from openzeppelin.access.ownable.library import Ownable

from token.ERC721.ERC721_Metadata_base import (
    ERC721_Metadata_initializer,
    ERC721_Metadata_tokenURI,
    ERC721_Metadata_setBaseTokenURI,
)

from src.interfaces.IFactsRegistry import IFactsRegistry, StorageSlot

// Herodotus Facts Registry Contract Address
const FACTS_REGISTRY_ADDRESS = 1;


//
// Storage Variables
//

// Mapping for storing linked L1 and L2 accounts
@storage_var
func linkedAddresses(l2_addr: felt) -> (l1_addr: felt) {
}


//
// Constructor
//

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
) {
    // everai_mirror | EAM
    ERC721.initializer('everai_mirror', 'EAM');
    ERC721_Metadata_initializer();
   // Ownable.initializer('0x038583B8B69dCa8322b559eC21Af8D0Ca44Fb6E22Fc5F96541ff42F02D79a8DB');
    //ERC721_Metadata_setBaseTokenURI(53, 105,112,102,115,58,47,47,81,109,80,114,90,90,56,105,121,121,89,72,86,87,111,74,100,77,116,81,53,104,80,68,113,70,114,54,111,72,72,49,69,116,88,104,106,78,55,50,98,107,100,88,105,99, 105,112,102,115,58,47,47,81,109,80,114,90,90,56,105,121,121,89,72,86,87,111,74,100,77,116,81,53,104,80,68,113,70,114,54,111,72,72,49,69,116,88,104,106,78,55,50,98,107,100,88,105,99);
    return ();
}

//
// Getters
//

@view
func getOwner{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (owner: felt) {
    let (owner) = Ownable.owner();
    return (owner=owner);
}

@view
func supportsInterface{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    interface_id: felt
) -> (success: felt) {
    let (success) = ERC165.supports_interface(interface_id);
    return (success,);
}

@view
func name{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (name: felt) {
    let (name) = ERC721.name();
    return (name,);
}

@view
func symbol{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (symbol: felt) {
    let (symbol) = ERC721.symbol();
    return (symbol,);
}

@view
func balanceOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(owner: felt) -> (
    balance: Uint256
) {
    let (balance: Uint256) = ERC721.balance_of(owner);
    return (balance,);
}

@view
func ownerOf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    token_id: Uint256
) -> (owner: felt) {
    let (owner: felt) = ERC721.owner_of(token_id);
    return (owner,);
}

@view
func tokenURI{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    token_id: Uint256
) -> (token_uri_len: felt, token_uri: felt*) {
    let (token_uri_len, token_uri) = ERC721_Metadata_tokenURI(token_id);
    return (token_uri_len=token_uri_len, token_uri=token_uri);
}


//
// Utils
// 

// func get_last_20_bytes(input: felt) -> felt {
//     alloc_locals {
//         let (local temp_array: felt*) = alloc_array(32);
//         let (local output: felt) = 0;

//         // Split input into an array of 32 felt values (each representing 8 bits)
//         split_int(input, 32, 256, temp_array);

//         // Take the last 20 felt values of the array
//         let (local last_20_array: felt*) = temp_array + 12;

//         // Concatenate the last 20 felt values into a single felt value
//         for i in 0..20 {
//             output |= last_20_array[i] * (256**(19-i));
//         }

//         return output;
//     }
// }



//
// Externals
//

@external
func setTokenURI{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    base_token_uri_len: felt, base_token_uri: felt*, token_uri_suffix: felt
) {
    Ownable.assert_only_owner();
    ERC721_Metadata_setBaseTokenURI(base_token_uri_len, base_token_uri, token_uri_suffix);
    return ();
}


@external
func linkL1wallet{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    message: felt,  public_key: felt,  signature_r: felt, signature_s: felt
) {
    //let (isValidSignature) = check_ecdsa_signature(message, public_key, signature_r, signature_s);
    //if(isValidSignature == TRUE) {

        // let (caller_address: felt) = get_caller_address();
        // alloc_locals;
        // let (keccak_ptr: felt*) = alloc();
        // local keccak_ptr_start: felt* = keccak_ptr;

        // with keccak_ptr {
        //     cairo_keccak_uint256s(n_elements=1, elements=[public_key]);
        // }

        // finalize_keccak(keccak_ptr_start=keccak_ptr_start, keccak_ptr_end=keccak_ptr);

        //let (hashed_public_key: Uint256) = memcpy(src=keccak_ptr, length=32);
        
        // let (l1_addr) = get_last_20_bytes(hashed_public_key);
        // linkedAddresses.write(caller_address, l1_addr);
    //}

    return ();
}

@external
func mint{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
   token_id: felt,
   block_num: felt,
   account_addr: felt,
   slot: StorageSlot,
   proof_sizes_bytes_len: felt,
   proof_sizes_bytes: felt*,
   proof_sizes_words_len: felt,
   proof_sizes_words: felt*,
   proofs_concat_len: felt,
   proofs_concat: felt*
) {

    // let (value) = IFactsRegistry.get_storage_uint(
    //     contract_address=FACTS_REGISTRY_ADDRESS,
    //     block=block_num,
    //     account_160=account_addr,
    //     slot=slot,
    //     proof_sizes_bytes_len=proof_sizes_bytes_len,
    //     proof_sizes_bytes=proof_sizes_bytes,
    //     proof_sizes_words_len=proof_sizes_words_len,
    //     proof_sizes_words=proof_sizes_words,
    //     proofs_concat_len=proofs_concat_len,
    //     proofs_concat=proofs_concat
    // );
    // parse the value and check hash(value, l2) == hash(l1, l2) (which will be a function param) 
    let (caller_address: felt) = get_caller_address();
    //let (value_arr) = uint256_to_bytes_array(value);
    //let (l1_proof_addr) = value_arr[12..32];
    //if(l1_proof_addr == linkedAddresses.read(l2_addr=caller_address) {
    ERC721._mint(caller_address, Uint256(token_id, 0));
    //}
    return ();
}

// @external
// func burn{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
//     token_id: Uint256,
//     block_num: felt,
//     account_addr: felt,
//     slot: felt,
//     proof_sizes_bytes_len: felt,
//     proof_sizes_bytes: felt,
//     proof_sizes_words_len: felt,
//     proof_sizes_words: felt,
//     proofs_concat_len: felt,
//     proofs_concat: felt
    
// ) {
//     let (value) = IFactsRegistry.get_storage_uint(
//         contract_address=FACTS_REGISTRY_ADDRESS,
//         block=block_num,
//         account_160=account_addr,
//         slot=slot,
//         proof_sizes_bytes_len=proof_sizes_bytes_len,
//         proof_sizes_bytes=proof_sizes_bytes,
//         proof_sizes_words_len=proof_sizes_words_len,
//         proof_sizes_words=proof_sizes_words,
//         proofs_concat_len=proofs_concat_len,
//         proofs_concat=proofs_concat
//     );
//     // parse the value and check hash(value, l2) == hash(l1, l2) (which will be a function param) 
//     let (caller_address: felt) = get_caller_address();
//     //let (value_arr) = uint256_to_bytes_array(value);
//     //let (l1_proof_addr) = value_arr[12..32];
//     let (owner: felt) = ERC721.owner_of(token_id);
//     //if(owner == caller_address && l1_proof_addr == linkedAddresses.read(l2_addr=caller_address)) {
//     //    ERC721._burn(token_id);
//     //}
//     return ();
// }