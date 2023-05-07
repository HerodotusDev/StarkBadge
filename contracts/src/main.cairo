%lang starknet

from starkware.cairo.common.cairo_builtins import (
    HashBuiltin,
    SignatureBuiltin,
    EcOpBuiltin,
    BitwiseBuiltin,
)
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.signature import check_ecdsa_signature
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.bool import FALSE, TRUE
from starkware.cairo.common.math import assert_le, unsigned_div_rem, split_felt
from starkware.cairo.common.pow import pow
from starkware.cairo.common.alloc import alloc

from starkware.cairo.common.cairo_secp.bigint import BigInt3, uint256_to_bigint
from starkware.cairo.common.cairo_secp.ec import EcPoint
from starkware.cairo.common.cairo_secp.signature import (
    recover_public_key,
    public_key_point_to_eth_address,
)

from openzeppelin.token.erc721.library import ERC721
from openzeppelin.introspection.erc165.library import ERC165
from openzeppelin.access.ownable.library import Ownable

from token.ERC721.ERC721_Metadata_base import (
    ERC721_Metadata_initializer,
    ERC721_Metadata_tokenURI,
    ERC721_Metadata_setBaseTokenURI,
)

from interfaces.IFactsRegistry import IFactsRegistry, StorageSlot

// Herodotus Facts Registry Contract Address
const FACTS_REGISTRY_ADDRESS = 1;

//
// Storage Variables
//

@storage_var
func linkedAddresses(l2_addr: felt) -> (l1_addr: felt) {
}

//
// Constructor
//

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    name: felt,
    symbol: felt,
    owner: felt,
    base_token_uri_len: felt,
    base_token_uri: felt*,
    token_uri_suffix: felt,
) {
    ERC721.initializer(name, symbol);
    ERC721_Metadata_initializer();
    Ownable.initializer(owner);
    ERC721_Metadata_setBaseTokenURI(base_token_uri_len, base_token_uri, token_uri_suffix);
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

func bitshift_left{range_check_ptr}(word: felt, num_bits: felt) -> (shifted: felt) {
    // verifies word fits in 64bits
    assert_le(word, 2 ** 64 - 1);

    // verifies shifted bits are not above 64
    assert_le(num_bits, 64);

    let (multiplicator) = pow(2, num_bits);
    let k = word * multiplicator;
    let (q, r) = unsigned_div_rem(k, 2 ** 64);
    return (r,);
}

func felt_to_uint256{range_check_ptr}(x) -> (x_: Uint256) {
    let split = split_felt(x);
    return (Uint256(low=split.low, high=split.high),);
}

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
func linkL1wallet{
    pedersen_ptr: HashBuiltin*,
    syscall_ptr: felt*,
    range_check_ptr,
    ec_op_ptr: EcOpBuiltin*,
    bitwise_ptr: BitwiseBuiltin*,
}(message: felt, public_key: felt, signatures_len: felt, signatures: felt*) -> (res: felt) {
    // what if i pass a signature which has different message than what we sign in the webapp but signed with the right addr?
    alloc_locals;

    let (isValidSignature) = check_ecdsa_signature(
        message=message, public_key=public_key, signature_r=signatures[0], signature_s=signatures[1]
    );

    if (isValidSignature == TRUE) {
        let (caller_address: felt) = get_caller_address();

        let (message_uint256) = felt_to_uint256(message);
        let (r_uint256) = felt_to_uint256(signatures[0]);
        let (s_uint256) = felt_to_uint256(signatures[1]);

        let (msg_hash: BigInt3) = uint256_to_bigint(message_uint256);
        let (r: BigInt3) = uint256_to_bigint(r_uint256);
        let (s: BigInt3) = uint256_to_bigint(s_uint256);

        let (public_key_point: EcPoint) = recover_public_key(msg_hash, r, s, signatures[2]);

        let (local keccak_ptr) = alloc();
        let (eth_address) = public_key_point_to_eth_address{keccak_ptr=keccak_ptr}(
            public_key_point
        );

        linkedAddresses.write(caller_address, eth_address);
        return (res=0);
    } else {
        return (res=1);
    }
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
    proofs_concat: felt*,
) -> (res: felt) {
    alloc_locals;
    let (value: Uint256) = IFactsRegistry.get_storage_uint(
        contract_address=FACTS_REGISTRY_ADDRESS,
        block=block_num,
        account_160=account_addr,
        slot=slot,
        proof_sizes_bytes_len=proof_sizes_bytes_len,
        proof_sizes_bytes=proof_sizes_bytes,
        proof_sizes_words_len=proof_sizes_words_len,
        proof_sizes_words=proof_sizes_words,
        proofs_concat_len=proofs_concat_len,
        proofs_concat=proofs_concat,
    );
    let (caller_address) = get_caller_address();

    let (high_last4bytes) = bitshift_left(value.high, 96);

    let l1_proof_addr = high_last4bytes + value.low;

    let (linkedL1Account) = linkedAddresses.read(l2_addr=caller_address);

    if (l1_proof_addr == linkedL1Account) {
        ERC721._mint(caller_address, Uint256(token_id, 0));
        return (res=0);
    }
    return (res=1);
}

@external
func burn{pedersen_ptr: HashBuiltin*, syscall_ptr: felt*, range_check_ptr}(
    token_id: Uint256,
    block_num: felt,
    account_addr: felt,
    slot: StorageSlot,
    proof_sizes_bytes_len: felt,
    proof_sizes_bytes: felt*,
    proof_sizes_words_len: felt,
    proof_sizes_words: felt*,
    proofs_concat_len: felt,
    proofs_concat: felt*,
) -> (res: felt) {
    alloc_locals;
    let (value) = IFactsRegistry.get_storage_uint(
        contract_address=FACTS_REGISTRY_ADDRESS,
        block=block_num,
        account_160=account_addr,
        slot=slot,
        proof_sizes_bytes_len=proof_sizes_bytes_len,
        proof_sizes_bytes=proof_sizes_bytes,
        proof_sizes_words_len=proof_sizes_words_len,
        proof_sizes_words=proof_sizes_words,
        proofs_concat_len=proofs_concat_len,
        proofs_concat=proofs_concat,
    );
    let (caller_address: felt) = get_caller_address();

    let (high_last4bytes) = bitshift_left(value.high, 96);
    let l1_proof_addr = high_last4bytes + value.low;

    let (linkedL1Account) = linkedAddresses.read(l2_addr=caller_address);

    let (owner: felt) = ERC721.owner_of(token_id);
    if (owner == caller_address and l1_proof_addr == linkedL1Account) {
        ERC721._burn(token_id);
        return (res=0);
    }
    return (res=1);
}
