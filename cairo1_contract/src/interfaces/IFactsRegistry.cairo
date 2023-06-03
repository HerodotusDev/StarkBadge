//###################
// IERC721 INTERFACE
//###################

#[derive(Drop, Serde)]
struct StorageSlot {
    word_1: felt252,
    word_2: felt252,
    word_3: felt252,
    word_4: felt252,
}

#[abi]
trait IFactRegistery {
    fn get_storage(
        block: felt252,
        account_160: felt252,
        slot: StorageSlot,
        proof_sizes_bytes_len: felt252,
        proof_sizes_bytes: felt252,
        proof_sizes_words_len: felt252,
        proof_sizes_words: felt252,
        proofs_concat_len: felt252,
        proofs_concat: felt252,
    ) -> (felt252, felt252, felt252);
    fn get_storage_uint(
        block: felt252,
        account_160: felt252,
        slot: StorageSlot,
        proof_sizes_bytes_len: felt252,
        proof_sizes_bytes: felt252,
        proof_sizes_words_len: felt252,
        proof_sizes_words: felt252,
        proofs_concat_len: felt252,
        proofs_concat: felt252,
    ) -> u256;
}
